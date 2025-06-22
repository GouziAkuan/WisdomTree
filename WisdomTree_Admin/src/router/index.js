import { createRouter, createWebHistory } from 'vue-router'
import { adminTokenStore } from '@/stores/token'
import DataView from '@/views/dataChart/DataView.vue'
import IndexPage from '@/views/index/IndexPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 登录
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    // 数据分析页
    {
      path: '/admindataChart',
      component: IndexPage,
      redirect: '/admindataChart/index',
      children: [
        {
          path: 'index',
          component: DataView
        }
      ]
    },
    // 树类中心
    {
      path: '/adminTreeType',
      component: () => import('@/views/index/IndexPage.vue'),
      redirect: '/adminTreeType/treeTypeCenter',
      children: [
        {
          path: 'treeTypeCenter',
          component: () => import('@/views/treeType/TreeTypeCenter.vue')
        },
        {
          path: 'addTreeType',
          component: () => import('@/views/treeType/AddTreeType.vue')
        },
        {
          path: 'updateTreeType',
          component: () => import('@/views/treeType/UpdateTreeType.vue')
        }
      ]
    },
    // 树中心
    {
      path: '/adminTree',
      component: () => import('@/views/index/IndexPage.vue'),
      redirect: '/adminTree/treeCenter',
      children: [
        {
          path: 'treeCenter',
          component: () => import('@/views/tree/TreeCenter.vue')
        },
        {
          path: 'addTree',
          component: () => import('@/views/tree/AddTree.vue')
        },
        {
          path: 'updateTree',
          component: () => import('@/views/tree/UpdateTree.vue')
        }
      ]
    },
    // 领养中心
    {
      path: '/adminAdopt',
      component: () => import('@/views/index/IndexPage.vue'),
      redirect: '/adminAdopt/adoptCenter',
      children: [
        {
          path: 'adoptCenter',
          component: () => import('@/views/adopt/AdoptCenter.vue')
        },
        {
          path: 'updateAdopt',
          component: () => import('@/views/adopt/UpdateAdopt.vue')
        }
      ]
    },
    // 3D模型
    {
      path: '/admin3dModel',
      component: () => import('@/views/3dModel/ModelView.vue')
    },
    // 3D树模型
    {
      path: '/TreeModel',
      component: () => import('@/views/3dModel/TreeModel.vue')
    },
    // 活动中心
    {
      path: '/adminActivity',
      component: () => import('@/views/index/IndexPage.vue'),
      redirect: '/adminActivity/activityCenter',
      children: [
        {
          path: 'activityCenter',
          component: () => import('@/views/activity/ActivityCenter.vue')
        },
        {
          path: 'addActivity',
          component: () => import('@/views/activity/AddActivity.vue')
        },
        {
          path: 'updateActivity',
          component: () => import('@/views/activity/UpdateActivity.vue')
        }
      ]
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    const tokenStore = adminTokenStore()
    if (!tokenStore.RefreshToken) {
      // 如果没有token，重定向到登录页
      next('/login')
    } else {
      // 如果有token，继续导航
      next()
    }
  } else {
    // 不是/admin开头的路径直接放行
    next()
  }
})

export default router
