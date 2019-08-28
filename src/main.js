// 入口
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import Vue from 'vue'
import App from './App.vue'
// router是路由router
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入了ElementUi
Vue.config.productionTip = false
Vue.use(ElementUI)
// 基于Vue的插件需要use一下

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
