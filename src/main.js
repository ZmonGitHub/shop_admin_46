// 入口
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import Vue from 'vue'
import App from './App.vue'
// router是路由router
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 引入了ElementUi
Vue.config.productionTip = false
Vue.use(ElementUI)
// 基于Vue的插件需要use一下
Vue.prototype.$axios = axios
// 把axios绑定要Vue原型上 使用方法：this.$axios.get(.....)

// 配置 axios 默认请求的基础地址, 将来所有的请求, 都会在前面拼上这个地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器,每次请求都加上请求头
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器,响应过来的数据，拿到自己需要的就行，别的就不要了。方便使用
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
