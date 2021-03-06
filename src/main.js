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
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入了ElementUi
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor /* { default global options } */)
// Vue.use(moment)

// 基于Vue的插件需要use一下
Vue.prototype.$axios = axios
// 把axios绑定要Vue原型上 使用方法：this.$axios.get(.....)
// 过滤时间，  *1000是因为后台传输的数据是秒，正常是毫秒
Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
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
  // console.log(response)
  if (response.data.meta.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
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
