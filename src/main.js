import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'assets/css/reset.css'
import moment from 'moment'
//导入自定义插件
import ServerHttps from 'plugins/https'

//引入elementUI库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//配置全局过滤器,处理时间戳
Vue.filter('fmtDate',(value) => {
  return moment(value).format('YYYY-MM-DD')
})
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(ServerHttps)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
