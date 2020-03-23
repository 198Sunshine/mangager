import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import 'assets/css/reset.css'
import moment from 'moment'
//导入自定义插件
import ServerHttps from 'plugins/https'

//引入elementUI库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入vue-table-with-tree-grid表格插件
import ZkTable from 'vue-table-with-tree-grid'
//导入echarts

//配置全局过滤器,处理时间戳
Vue.filter('fmtDate',(value) => {
  return moment(value).format('YYYY-MM-DD')
})
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(ServerHttps)
Vue.use(ZkTable)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
