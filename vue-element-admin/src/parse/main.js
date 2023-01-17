import App from './App'
import Vue from 'vue'
import store from '../store'
import Cookies from 'js-cookie'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import '../styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '../icons' // icon
import '../permission' // permission control
import '../utils/error-log' // error log
import * as filters from '../filters' // global filters
import router from '../router'
// import { createWebHashHistory, createRouterMatcher } from './router@4.js'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

const _routerRoot = { _router: router }
Vue.prototype._routerRoot = _routerRoot
Vue.util.defineReactive(Vue.prototype, '_routerRoot', _routerRoot)

const routes = router.options.routes
Object.defineProperty(Vue.prototype, '$routes', {
  get: function get() { return routes }
})

// const resolveRouter = this.$router.resolve(newVal)
// this.$route = resolveRouter.route

// Object.defineProperty(Vue.prototype, '$route', {
//   get: function get() { return this._routerRoot._route }
// })
// const dd = createRouterMatcher(routes, {
//   history: createWebHashHistory(),
//   routes
// })
// const mat = dd.getRoutes()
// console.log(mat)
// const resolveRouter = router.resolve('/dashboard')
// Vue.util.defineReactive(Vue.prototype, '_route', resolveRouter.route)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
