import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/Users')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Roles')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Params')

const GoodsList = () => import(/* webpackChunkName: "goodsList_add" */ '@/components/goods/List')
const Add = () => import(/* webpackChunkName: "goodsList_add" */ '@/components/goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '@/components/report/Report')

// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'

// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'

// import GoodsList from '@/components/goods/List'
// import Add from '@/components/goods/Add'

// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'

Vue.use(VueRouter)

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放心
  // next() 放行  next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
