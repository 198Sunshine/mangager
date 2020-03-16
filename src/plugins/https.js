import axios from "axios"
import NProgress from  'nprogress'
import 'nprogress/nprogress.css'
const MyPlugin = {}

MyPlugin.install = (Vue)=> {
  axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1`
  /*axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });*/
  //设置头部请求拦截器
  axios.interceptors.request.use((config) =>{
    //开启进度条
    NProgress.start()
    if(config.url !== '/login'){
      config.headers.common['Authorization']  = window.sessionStorage.getItem('token')
    }
    return config
  },(err) =>{
     return Promise.reject(err)
  })

  axios.interceptors.response.use((response) => {
    // 完成进度条
    NProgress.done()
    return response
  }, (error) =>{
    // 对响应错误做点什么
    return Promise.reject(error)
  })

  Vue.prototype.$https = axios
}

export default MyPlugin
