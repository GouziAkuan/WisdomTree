<script setup>
import { ref, onMounted, onUnmounted, shallowRef, markRaw, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElCard, ElRow, ElCol, ElLoading, ElMessage } from 'element-plus'
import { SuccessFilled, Menu, List, UserFilled, TrendCharts } from '@element-plus/icons-vue'
import { requestWithRetry } from '@/common/interfaces/request'
import dayjs from 'dayjs'
import {
  getTotalStatisticsConfig,
  getTreeTypeDistributionConfig,
  getAdoptionTrendConfig,
  getTreeTypeAdoptionsConfig,
  getAdoptionTypeRankingConfig
} from '@/common/interfaces/dataChart.interface'

//统计卡片数据
const stats = shallowRef([
  {
    title: '树木总数',
    value: 24,
    color: 'linear-gradient(135deg,#05B0FF 0%,#6BFFCA 100%)',
    icon: SuccessFilled
  },
  {
    title: '树种总数',
    value: 36,
    color: 'linear-gradient(135deg, #FF9A8B 0%, #FF6B88 100%)',
    icon: Menu
  },
  {
    title: '领养总数',
    value: 18,
    color: 'linear-gradient(135deg, #FFD86B 0%, #FFB56B 100%)',
    icon: List
  },
  {
    title: '用户总数',
    value: 8,
    color: 'linear-gradient(135deg, #A78BFA 0%, #D46BFD 100%)',
    icon: UserFilled
  }
])
// 树种分布
const speciesData = ref([
  { value: 73, name: '银杏' },
  { value: 51, name: '香樟' },
  { value: 43, name: '梧桐' },
  { value: 33, name: '水杉' },
  { value: 30, name: '枫树' }
])
// 领养趋势
const adoptData = ref([12, 20, 15, 8, 7, 11, 13])
// 树种领养排行
const adoptSpeciesData = ref([
  { name: '银杏', count: 40 },
  { name: '香樟', count: 30 },
  { name: '梧桐', count: 20 },
  { name: '水杉', count: 18 },
  { name: '枫树', count: 15 }
])
// 领养类型排行
const adoptTypeData = ref([
  { name: '爱情纪念树', count: 40 },
  { name: '友情纪念树', count: 35 },
  { name: '亲情纪念树', count: 32 },
  { name: '青春纪念树', count: 28 },
  { name: '事业纪念树', count: 25 },
  { name: '平安纪念树', count: 20 }
])

// 新增加载状态
const loading = ref(true)

// 图表引用
const chart1 = ref(null)
const chart2 = ref(null)
const chart3 = ref(null)
const chart4 = ref(null)
let chartInstance1 = null
let chartInstance2 = null
let chartInstance3 = null
let chartInstance4 = null

// 优化后的配色方案
const chartColors = [
  '#6BFFCA',
  '#FF9A8B',
  '#FFD86B',
  '#A78BFA',
  '#6B83FF',
  '#05B0FF',
  '#FF6B88',
  '#D46BFD',
  '#6BD2FF',
  '#B0FF6B'
]

// 公用配置项优化
const chartOptions = {
  pie: {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical', // 垂直排列
      right: 10,
      top: 'middle',
      textStyle: { color: '#666' }
    },
    series: [
      {
        name: '树种分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'], // 往左一点，避免和图例重叠
        data: speciesData.value,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 3
        },
        label: {
          color: '#333',
          fontSize: 12
        },
        labelLine: {
          length: 10, // ← 控制第一段线的长度
          length2: 10, // ← 控制第二段线的长度
        }
      }
    ],
    color: chartColors
  },
  line: {
    legend: {
      data: ['领养数量'], // 需要与 series.name 对应
      top: 10,
      textStyle: { color: '#666' }
    },
    tooltip: {
      // 新增tooltip配置
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: '#eee',
      textStyle: {
        color: '#666'
      },
      formatter: (params) => {
        return `<div style="font-size:14px;color:#666;">
        <div style="margin-bottom:5px;">${params[0].name}</div>
        <div style="display:flex;align-items:center;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#05B0FF;margin-right:8px;"></span>
          领养数量：${params[0].value}
        </div>
      </div>`
      }
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#999' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#999' } }
    },
    series: [
      {
        name: '领养数量',
        data: adoptData.value,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#6BFFCA80' },
              { offset: 1, color: '#6BFFCA00' }
            ]
          }
        },
        lineStyle: {
          width: 3,
          shadowColor: '#6BFFCA40',
          shadowBlur: 10,
          shadowOffsetY: 8
        },
        itemStyle: {
          color: '#05B0FF',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ],
    color: chartColors
  },
  bar: {
    legend: {
      data: ['领养数量'], // 需要与 series.name 对应
      top: 10,
      textStyle: { color: '#666' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: adoptSpeciesData.value.map((i) => i.name),
      axisLine: { lineStyle: { color: '#999' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#999' } }
    },
    series: [
      {
        name: '领养数量',
        data: adoptSpeciesData.value.map((i) => i.count),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#A78BFA' },
              { offset: 1, color: '#D46BFD' }
            ]
          },
          borderRadius: [8, 8, 0, 0],
          shadowColor: '#A78BFA40',
          shadowBlur: 8,
          shadowOffsetY: 4
        }
      }
    ]
  },
  horizontalBar: {
    legend: {
      data: ['领养数量'], // 需要与 series.name 对应
      top: 10,
      textStyle: { color: '#666' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: '#eee' }
      }
    },
    yAxis: {
      type: 'category',
      data: adoptTypeData.value.map((i) => i.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 20,
        fontSize: 14
      }
    },
    series: [
      {
        name: '领养数量',
        type: 'bar',
        data: adoptTypeData.value.map((i) => i.count),
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#6BFFCA' },
              { offset: 1, color: '#05B0FF' }
            ]
          },
          borderRadius: [0, 8, 8, 0],
          shadowColor: '#05B0FF40',
          shadowBlur: 8,
          shadowOffsetX: 2
        },
        label: {
          show: true,
          position: 'right',
          color: '#666',
          fontSize: 12
        }
      }
    ]
  }
}

// 初始化图表
const initChart = (dom, option) => {
  const chart = echarts.init(dom)
  chart.setOption(option)
  return chart
}

// 监听窗口大小变化
const handleResize = () => {
  chartInstance1?.resize()
  chartInstance2?.resize()
  chartInstance3?.resize()
  chartInstance4?.resize()
}

// 向后端获取所有统计数据
const fetchAllData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 并行请求所有接口
    const [totalRes, speciesRes, trendRes, speciesAdoptRes, typeRankRes] = await Promise.all([
      requestWithRetry(getTotalStatisticsConfig()),
      requestWithRetry(getTreeTypeDistributionConfig()),
      requestWithRetry(getAdoptionTrendConfig()),
      requestWithRetry(getTreeTypeAdoptionsConfig()),
      requestWithRetry(getAdoptionTypeRankingConfig())
    ])

    // 处理总数统计
    stats.value = [
      {
        title: '树木总数',
        value: totalRes.data.data.totalTrees,
        color: 'linear-gradient(135deg,#05B0FF 0%,#6BFFCA 100%)',
        icon: markRaw(SuccessFilled)
      },
      {
        title: '树种总数',
        value: totalRes.data.data.totalTreeTypes,
        color: 'linear-gradient(135deg, #FF9A8B 0%, #FF6B88 100%)',
        icon: markRaw(Menu)
      },
      {
        title: '领养总数',
        value: totalRes.data.data.totalAdoptions,
        color: 'linear-gradient(135deg, #FFD86B 0%, #FFB56B 100%)',
        icon: markRaw(List)
      },
      {
        title: '用户总数',
        value: totalRes.data.data.totalUsers,
        color: 'linear-gradient(135deg, #A78BFA 0%, #D46BFD 100%)',
        icon: markRaw(UserFilled)
      }
    ]

    // 处理树种分布数据（饼图）
    speciesData.value = speciesRes.data.data.map((item) => ({
      value: item.count,
      name: item.treeType
    }))

    // 处理领养趋势数据（折线图）
    adoptData.value = trendRes.data.data.map((item) => item.count)
    chartOptions.line.xAxis.data = trendRes.data.data.map((item) =>
      dayjs(item.date).format('MM-DD')
    )

    // 处理树种领养排行（柱状图）
    adoptSpeciesData.value = speciesAdoptRes.data.data.map((item) => ({
      name: item.treeType,
      count: item.count
    }))

    // 处理领养类型排行（横向柱状图）
    adoptTypeData.value = typeRankRes.data.data.map((item) => ({
      name: item.adoptionType,
      count: item.count
    }))

    // 更新图表配置
    updateChartOptions()
  } catch (error) {
    ElMessage.error('数据加载失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loadingInstance.close()
    loading.value = false
  }
}

// 更新图表配置的方法
const updateChartOptions = () => {
  chartOptions.pie.series[0].data = speciesData.value
  chartOptions.line.series[0].data = adoptData.value
  chartOptions.bar.xAxis.data = adoptSpeciesData.value.map((i) => i.name)
  chartOptions.bar.series[0].data = adoptSpeciesData.value.map((i) => i.count)
  chartOptions.horizontalBar.yAxis.data = adoptTypeData.value.map((i) => i.name)
  chartOptions.horizontalBar.series[0].data = adoptTypeData.value.map((i) => i.count)

  // 重新渲染图表
  nextTick(() => {
    chartInstance1?.setOption(chartOptions.pie)
    chartInstance2?.setOption(chartOptions.line)
    chartInstance3?.setOption(chartOptions.bar)
    chartInstance4?.setOption(chartOptions.horizontalBar)
  })
}

// 页面挂载时执行初始化操作
onMounted(async () => {
  // 获取数据
  await fetchAllData()
  // 初始化图表（移动到数据加载完成后）
  chartInstance1 = initChart(chart1.value, chartOptions.pie)
  chartInstance2 = initChart(chart2.value, chartOptions.line)
  chartInstance3 = initChart(chart3.value, chartOptions.bar)
  chartInstance4 = initChart(chart4.value, chartOptions.horizontalBar)
  window.addEventListener('resize', handleResize)
})

// 页面卸载时销毁图表实例
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance1?.dispose()
  chartInstance2?.dispose()
  chartInstance3?.dispose()
  chartInstance4?.dispose()
})
</script>

<template>
  <div class="page-container">
    <el-row :gutter="20" class="stats-row">
      <el-col v-for="(item, index) in stats" :key="index" :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" :style="{ background: item.color }">
          <div class="stat-content">
            <div class="icon-wrapper">
              <component :is="item.icon" class="stat-icon" />
            </div>
            <div class="text-wrapper">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12" class="mb-6">
        <el-card class="chart-card">
          <div class="chart-header">
            <el-icon class="chart-icon" :size="30"><Promotion /></el-icon>
            <h3 class="chart-title">树种分布</h3>
          </div>
          <div ref="chart1" class="chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12" class="mb-6">
        <el-card class="chart-card">
          <div class="chart-header">
            <el-icon class="chart-icon" :size="30"><TrendCharts /></el-icon>
            <h3 class="chart-title">领养趋势（最近7天）</h3>
          </div>
          <div ref="chart2" class="chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12" class="mb-6">
        <el-card class="chart-card">
          <div class="chart-header">
            <el-icon class="chart-icon" :size="30"><List /></el-icon>
            <h3 class="chart-title">领养类型排行</h3>
          </div>
          <div ref="chart4" class="chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12" class="mb-6">
        <el-card class="chart-card">
          <div class="chart-header">
            <el-icon class="chart-icon" :size="30"><Histogram /></el-icon>
            <h3 class="chart-title">树种领养排行</h3>
          </div>
          <div ref="chart3" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="css" scoped>
@import url('../../assets//css/datachart.css');
</style>
