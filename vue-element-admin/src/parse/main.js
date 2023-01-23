import App from './App'
import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '../styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '../icons' // icon
import '../permission' // permission control
import '../utils/error-log' // error log
import router from '../router'
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.config.productionTip = false

const childView = router.options.routes[5].children[0].component
console.log(router.options.routes)

// let cnt = 1

// var View = {
//   name: 'RouterView',
//   functional: true,
//   props: {
//     name: {
//       type: String,
//       default: 'default'
//     }
//   },
//   render: function render(_, ref) {
//     console.log('<router-view></router-view>')
//     var parent = ref.parent
//     var h = parent.$createElement
//     return h(childView)
//     // if (cnt > 0) {
//     //   return h(childView)
//     // }
//     // return h()
//   }
// }
// Vue.component('RouterView', View)

// var toTypes = [String, Object]
// var eventTypes = [String, Array]
// var Link = {
//   name: 'RouterLink',
//   props: {
//     to: {
//       type: toTypes,
//       required: true
//     },
//     tag: {
//       type: String,
//       default: 'a'
//     },
//     exact: Boolean,
//     append: Boolean,
//     replace: Boolean,
//     activeClass: String,
//     exactActiveClass: String,
//     event: {
//       type: eventTypes,
//       default: 'click'
//     }
//   },
//   render: function render(h) {
//     // var ref = router.resolve(this.to)
//     // var href = ref.href
//     var href = 'javascript:;'

//     var classes = {}
//     var data = {
//       class: classes
//     }
//     data.on = function() { console.log('路由跳转') }
//     data.attrs = { href: href }
//     return h(this.tag, data, this.$slots.default)
//   }
// }
// Vue.component('RouterLink', Link)

new Vue({
  el: '#app',
  render: h => h(App)
})
