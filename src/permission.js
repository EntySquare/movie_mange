import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单 定义哪些页面可以在未登录状态下访问，这里仅允许 /login 免鉴权。


// router.beforeEach(async (to, from, next) => {
//   NProgress.start()
//   if (getToken()) {

//     if (to.path === '/login') {
//       next({ path: '/' })
//       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//     } else {
//       const username = ''
//       await store.dispatch('GenerateRoutes', { menusList, username })
//       next()
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
//   }
// })
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const authority = store.getters.authority;
      // 根据 authority 判断是否有权限访问特定页面
      if (authority !== 'all' && (to.path === '/product/addProduct' || to.path === '/ums/admin' || to.path === '/vote/addVote')) {
        Message.error('您没有权限访问此页面');
        next({ path: '/' })  // 如果没有权限，重定向到首页
        return;
      }

      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log('reresresresresress', res);

          let menus = res.menus;
          let username = res.username;
          store.dispatch('GenerateRoutes', { menus, username }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})



router.afterEach(() => {
  NProgress.done() // 结束Progress
})
