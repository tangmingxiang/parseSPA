import router from '../router'
// import { createWebHistory, createWebHashHistory, createRouterMatcher } from './router@4.js'
import { createWebHashHistory, createRouterMatcher } from './router@4.js'
// import { createWebHistory, createWebHashHistory, createRouterMatcher } from 'vue-router'
// import 'https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js'
// import * as vRouter from 'vue-router'

const routers = (router.getRoutes && router.getRoutes()) || router.options.routes
console.log(routers)
const dd = createRouterMatcher(routers, {
  history: createWebHashHistory(),
  routes: routers // `routes: routes` 的缩写
})
console.log(dd)
console.log(dd.getRoutes())
