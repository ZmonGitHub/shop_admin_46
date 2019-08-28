import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
Vue.use(Router)

// 这里让 router等于这个路由规则，拿到路由实例以后下面守卫
const router = new Router({
  // router是路由插件
  // routes是规则
  routes: [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/index', component: Index }
  ]
})
// 导航守卫方法放在router路由里
// 路由就相当于前台，你问去哪里的路 他告诉你，把关公司门口
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 从loacalStorage里拿到token
  const token = localStorage.getItem('token')
  // 判断，如果有正确的Token就放行，next(),如果没有就 去/login登录页
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
// 暴露出这个路由
export default router
// 把这个 router实例返回出去， main在引入的时候就是一个深度加工过的router
