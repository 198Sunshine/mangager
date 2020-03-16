import Vue from 'vue'
import VueRouter from 'vue-router'

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
      {path:'/reports',component:Report}

      ]
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
