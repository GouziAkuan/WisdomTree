<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { requestWithRetry } from '@/common/interfaces/request'
import { getAreaDistributionConfig } from '@/common/interfaces/dataChart.interface'
import { ElMessage, ElLoading } from 'element-plus'

// 使用 useRouter 获取路由实例
const router = useRouter()

// 跳转方法
const handleEdit = () => {
  router.push({
    path: '/admindataChart/index'
  })
}

// TODO：模型部分
// 更新场景背景设置
const bgSettings = {
  textureUrl: '/images/kjbg.jpg', // 科技背景图路径
  intensity: 0.8 // 背景亮度
}

// 区域数据配置
const areaData = ref([
  { name: '食堂', x: -6, z: 2, count: 15, color: '#6a00ff', glow: '#ad6dff' },
  { name: '图书馆', x: 4, z: 0, count: 9, color: '#00e5ff', glow: '#6dffff' },
  { name: '教学楼', x: 4, z: 7, count: 22, color: '#00ffa2', glow: '#6dffcf' },
  { name: '寝室', x: -5, z: -6, count: 18, color: '#ff00ff', glow: '#ff6dff' },
  { name: '运动场', x: -1, z: -2, count: 12, color: '#ff6d00', glow: '#ffa66d' }
])

// 区域配置
const AREA_CONFIG = {
  食堂: { x: -6, z: 2, color: '#6a00ff', glow: '#ad6dff' },
  图书馆: { x: 4, z: 0, color: '#00e5ff', glow: '#6dffff' },
  教学楼: { x: 4, z: 7, color: '#00ffa2', glow: '#6dffcf' },
  寝室: { x: -5, z: -6, color: '#ff00ff', glow: '#ff6dff' },
  运动场: { x: -1, z: -2, color: '#ff6d00', glow: '#ffa66d' }
}

// 默认配置（用于处理未知区域）
const DEFAULT_CONFIG = {
  x: 0,
  z: 0,
  color: '#cccccc',
  glow: '#ffffff'
}

// 获取区域数据
const fetchAreaData = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载区域数据',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const res = await requestWithRetry(getAreaDistributionConfig())
    // 转换数据结构，添加颜色和位置信息
    areaData.value = res.data.data.map((item) => {
      const config = AREA_CONFIG[item.area] || {
        ...DEFAULT_CONFIG,
        // 为未知区域生成随机位置（避开现有区域）
        x: THREE.MathUtils.randFloatSpread(24), // -12到12之间
        z: THREE.MathUtils.randFloatSpread(24)
      }

      return {
        name: item.area,
        count: item.count,
        x: config.x,
        z: config.z,
        color: config.color,
        glow: config.glow
      }
    })
  } catch (error) {
    console.error('获取区域数据失败:', error)
    ElMessage.error('区域数据加载失败')
  } finally {
    loading.close()
  }
}

// 在areaData定义后添加树木配置
const treeSettings = {
  count: 50, // 树木总数
  minDistance: 1.5, // 树木与区域标记的最小距离
  trunkColors: ['#8b4513', '#654321', '#5d432c'], // 树干颜色
  crownColors: ['#2d5a27', '#3c8d2f', '#4ca64c'] // 树冠颜色
}

let scene, camera, renderer, controls
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let currentIntersect = null

// 创建树木的方法
function createTrees() {
  // 生成有效位置
  const getValidPosition = () => {
    let x, z, isValid
    do {
      x = THREE.MathUtils.randFloatSpread(28) // -14到14之间
      z = THREE.MathUtils.randFloatSpread(28)
      isValid = areaData.value.every(
        (area) => Math.sqrt((x - area.x) ** 2 + (z - area.z) ** 2) > treeSettings.minDistance
      )
    } while (!isValid)
    return { x, z }
  }

  // 创建树木几何体（复用几何体提升性能）
  const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8)
  const crownGeometry = new THREE.ConeGeometry(0.6, 1.5, 6)

  for (let i = 0; i < treeSettings.count; i++) {
    const pos = getValidPosition()

    // 创建树干
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setStyle(
        treeSettings.trunkColors[Math.floor(Math.random() * treeSettings.trunkColors.length)]
      ),
      roughness: 0.8,
      metalness: 0.1
    })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.set(pos.x, 0.5, pos.z)
    trunk.castShadow = true
    scene.add(trunk)

    // 创建树冠
    const crownMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setStyle(
        treeSettings.crownColors[Math.floor(Math.random() * treeSettings.crownColors.length)]
      ),
      roughness: 0.6,
      metalness: 0.05
    })
    const crown = new THREE.Mesh(crownGeometry, crownMaterial)
    crown.position.set(pos.x, 1.8, pos.z)
    crown.castShadow = true
    scene.add(crown)

    // 添加随机缩放
    const scale = 0.8 + Math.random() * 0.4
    trunk.scale.set(scale, scale, scale)
    crown.scale.set(scale, scale, scale)

    // 添加轻微旋转
    crown.rotation.y = Math.random() * Math.PI
  }
}

// 初始化场景
function initScene() {
  // 创建场景
  scene = new THREE.Scene()

  // 加载科技感背景
  const bgLoader = new THREE.TextureLoader()
  bgLoader.load(
    bgSettings.textureUrl, // 确保图片放在public目录
    (texture) => {
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter
      scene.background = texture
      scene.backgroundIntensity = bgSettings.intensity
    },
    undefined,
    (err) => console.error('背景加载失败:', err)
  )

  // 设置相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(10, 15, 20)

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.querySelector('.page').appendChild(renderer.domElement)

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 20, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 加载地面贴图（需要将map.jpg放在public目录）
  const textureLoader = new THREE.TextureLoader()
  const groundTexture = textureLoader.load(
    '/images/screenshot.png', // 替换为你的地图路径
    undefined,
    undefined,
    (err) => console.error('地面贴图加载失败:', err)
  )

  // 添加地面
  const groundGeometry = new THREE.PlaneGeometry(30, 30)
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    color: 0xcccccc,
    roughness: 0.1
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 创建区域柱状图
  areaData.value.forEach((area) => {
    // 地面标识（改为发光圆环）
    const baseGeometry = new THREE.RingGeometry(1.2, 1.5, 32)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: area.color,
      emissive: area.glow,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.8
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.rotation.x = -Math.PI / 2
    base.position.set(area.x, 0.01, area.z)
    scene.add(base)

    // 数据柱（改为棱柱形）
    const height = area.count * 0.4
    const barGeometry = new THREE.CylinderGeometry(0.6, 0.4, height, 32)
    // 创建渐变纹理
    const gradientTexture = createGradientTexture(area.color)
    const barMaterial = new THREE.MeshPhysicalMaterial({
      color: area.color,
      emissive: area.glow,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      map: gradientTexture,
      transparent: true,
      opacity: 0.98
    })
    const bar = new THREE.Mesh(barGeometry, barMaterial)
    bar.position.set(area.x, height / 2 + 0.2, area.z)
    // 添加边缘高光
    const edges = new THREE.EdgesGeometry(barGeometry)
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      })
    )
    bar.add(line)
    scene.add(bar)

    // 添加3D文字标签
    createTextLabel(area)
  })

  // 添加交互控制
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 添加辅助灯光
  const pointLight = new THREE.PointLight(0xffffff, 30, 50)
  pointLight.position.set(0, 25, 0)
  scene.add(pointLight)

  // 添加窗口大小监听
  window.addEventListener('resize', onWindowResize)
  createTrees()
}

// 创建渐变纹理函数
function createGradientTexture(baseColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  const color = new THREE.Color(baseColor)
  gradient.addColorStop(0, color.getStyle())
  gradient.addColorStop(0.5, color.clone().multiplyScalar(1.2).getStyle())
  gradient.addColorStop(1, color.clone().multiplyScalar(0.8).getStyle())

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// 修改文字标签创建方法
function createTextLabel(area) {
  // 计算柱子高度
  const barHeight = area.count * 0.4 + 0.2

  // 创建文字标签
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 512
  canvas.height = 256

  // 绘制带光晕的文字
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'

  // 文字阴影
  ctx.shadowColor = area.color
  ctx.shadowBlur = 20
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillText(area.name, 256, 140)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  })

  // 定位在柱子顶部上方
  const textSprite = new THREE.Sprite(material)
  textSprite.position.set(area.x, barHeight + 2.5, area.z) // 高出柱子2个单位
  textSprite.scale.set(4, 2, 1)
  scene.add(textSprite)

  // 添加指示箭头
  const arrowGeometry = new THREE.ConeGeometry(0.3, 1.2, 6)
  const arrowMaterial = new THREE.MeshBasicMaterial({
    color: area.color,
    transparent: true,
    opacity: 0.8
  })
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
  arrow.rotation.z = Math.PI // 调整箭头朝向
  arrow.position.copy(textSprite.position)
  arrow.position.y -= 1.5 // 定位在文字和柱子之间
  scene.add(arrow)
}

// 窗口大小变化处理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

let animationFrameId = null // 用于保存动画循环ID

// 动画循环
function animate() {
  animationFrameId = requestAnimationFrame(animate) // 保存ID
  controls.update()

  // 射线检测
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    if (!currentIntersect) {
      document.body.style.cursor = 'pointer'
    }
    currentIntersect = intersects[0]
    showTooltip(currentIntersect)
  } else {
    if (currentIntersect) {
      document.body.style.cursor = 'auto'
    }
    currentIntersect = null
    hideTooltip()
  }

  renderer.render(scene, camera)
}

// 显示提示工具
function showTooltip(intersect) {
  const area = areaData.value.find(
    (a) =>
      Math.abs(intersect.object.position.x - a.x) < 0.1 &&
      Math.abs(intersect.object.position.z - a.z) < 0.1
  )

  if (area) {
    const tooltip = document.getElementById('tooltip')
    tooltip.style.display = 'block'
    tooltip.style.left = `${(pointer.x * window.innerWidth) / 2 + window.innerWidth / 2 + 15}px`
    tooltip.style.top = `${(-pointer.y * window.innerHeight) / 2 + window.innerHeight / 2}px`
    tooltip.innerHTML = `
      <strong>${area.name}</strong><br>
      领养数量: ${area.count}颗
    `
  }
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip')
  if (tooltip) {
    // 检查元素是否存在
    tooltip.style.display = 'none'
  }
}

// 鼠标移动事件
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

// TODO:图表部分
// 新增响应式变量
const showChart = ref(true)
let chartInstance = null

// 修改后的点击处理
const handleShowChart = () => {
  showChart.value = !showChart.value
  if (showChart.value) {
    nextTick(() => {
      initChart()
    })
  } else {
    disposeChart()
  }
}

// 初始化图表
function initChart() {
  const chartDom = document.getElementById('chart')
  chartInstance = echarts.init(chartDom)

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '区域领养占比',
      textStyle: {
        color: '#fff',
        fontSize: 25
      },
      left: 'center',
      top: '5%' // 标题位置上移
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#00f7ff',
      Width: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: '{b}: {c}颗({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: '5%',
      top: '1%',
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      itemGap: 10,
      itemWidth: 12,
      itemHeight: 12,
      pageIconColor: '#fff',
      pageTextStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '45%'], // 缩小环状图尺寸
        // center: ['40%', '55%'], // 调整中心位置
        // 下移
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n\n{c}颗({d}%)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold'
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 30
        },
        data: areaData.value.map((item) => ({
          value: item.count,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          label: {
            show: true,
            fontSize: 16
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 窗口大小变化监听
  window.addEventListener('resize', handleChartResize)
}

// 处理图表响应式
function handleChartResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 销毁图表
function disposeChart() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleChartResize)
}

onMounted(async () => {
  // 先获取数据
  await fetchAreaData()
  initScene()
  animate()
  initChart()
  window.addEventListener('pointermove', onPointerMove)
})

onUnmounted(() => {
  // 停止动画循环
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 安全移除渲染器DOM元素
  if (renderer) {
    // 方式1：检查父节点是否存在
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }

    // 方式2：更彻底的清理
    renderer.dispose() // 释放WebGL资源
    renderer.forceContextLoss() // 强制上下文丢失
    renderer.domElement = null // 清除引用
    renderer = null
  }

  // 其他清理代码...
  disposeChart()
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <div class="title">领养分布区域3D模型</div>
  <div class="page">
    <div class="back" @click="handleEdit">
      <p>返回</p>
    </div>

    <div class="chart-btn" @click="handleShowChart">
      <p>{{ showChart ? '隐藏数据' : '查看详细数据' }}</p>
    </div>

    <!-- 新增图表容器 -->
    <transition name="chart-transition">
      <div v-if="showChart" id="chart" class="chart-container"></div>
    </transition>

    <div id="tooltip" class="tooltip"></div>
  </div>
</template>

<style scoped>
@import url('../../assets/css/ModelView.css');
</style>
