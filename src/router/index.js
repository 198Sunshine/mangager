import Vue from 'vue'
import VueRouter from 'vue-router'
//引用element-ui,显示消息框
import { Message } from 'element-ui'
import GoodAdd from "../views/home/goods/GoodAdd";

Vue.use(VueRouter)

const Login =() => import ('views/login/Login')
const Home = () => import('views/home/Home')

const User = () => import('views/home/user/User')
const Right = () => import('views/home/rights/Right')
const Role = () => import('views/home/rights/Role')
const Good = () => import('views/home/goods/Good')
const Param = () => import('views/home/goods/Param')
const Category = () => import('views/home/goods/Category')
const Order = () => import('views/home/order/Order')
const Report = () => import('views/home/report/Report')
const Add =() => import('views/home/goods/GoodAdd')
const Edit =() => import('views/home/goods/GoodEdit')
const Welcome =() => import('views/welcome/Welcome')
const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    children:[
      {path: '/users', component: User},
      {path:'/rights',component:Right},
      {path:'/roles',component:Role},
      {path:'/goods',component:Good},
      {path:'/params',component:Param},
      {path:'/categories',component:Category},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report},
      {path:'/add',component:Add},
      {path:'/welcome', component:Welcome},
      {path:'/edit',component:Edit}
      ]
  }
]

const router = new VueRouter({
  routes
})

//设置路由守卫
router.beforeEach((to, from, next) => {
  //console.log(to)
  //如果是请求登录，则直接next
  //如果请求的不是登录，判断token
    // 存在token,next
    // 不存在token,跳转到登录页面
  to.path === '/login' ? next() : window.sessionStorage.getItem('token')
    ? next() : router.push('/login') ? Message.error('请求错误') : next()
})
export default router
