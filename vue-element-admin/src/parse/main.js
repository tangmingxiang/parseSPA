import App from './App'
import Vue from 'vue'
import store from '../store'
import router from '../router'
import Cookies from 'js-cookie'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import { createWebHashHistory, createRouterMatcher } from './router@4.js'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import '../styles/element-variables.scss'

import '@/styles/index.scss' // global css

import '../icons' // icon
import '../permission' // permission control
import '../utils/error-log' // error log

import * as filters from '../filters' // global filters

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

const routes = router.options.routes
console.log(routes)

const dd = createRouterMatcher(routes, {
  history: createWebHashHistory(),
  routes
})
const mat = dd.getRoutes()
console.log(mat)

let resolveRouter = router.resolve('/dashboard')
const resolveRouterBak = Object.assign({}, resolveRouter)
console.log(resolveRouter)
Vue.util.defineReactive(Vue.prototype, '_route', resolveRouter.route)

Vue.prototype._routerRoot = {}
Vue.prototype._routerRoot._router = router

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(_, ref) {
    console.log(ref)
    var props = ref.props
    var children = ref.children
    var parent = ref.parent
    var data = ref.data

    // console.log(Object.getOwnPropertyDescriptors(ref))
    // console.log(Object.getOwnPropertyDescriptors(ref.parent))
    // ref.parent.$route = resolveRouter.route
    // Object.assign(ref.parent, { $route: resolveRouter.route })

    // used by devtools to display a router-view badge
    data.routerView = true

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement
    var name = props.name
    // var route = parent.$route
    var route = resolveRouter && resolveRouter.route
    if (!route) {
      return h()
    }
    var cache = parent._routerViewCache || (parent._routerViewCache = {})

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0
    var inactive = false
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    // var matched = route.matched[depth]
    var matched = mat[10]['record']
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null
      return h()
    }

    var component = cache[name] = matched.components[name]

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function(vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name]
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val
      }
    }
    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    if (!('hook' in data)) {
      data.hook = {}
    }
    data.hook = {}.prepatch = function(_, vnode) {
      matched.instances[name] = vnode.componentInstance
    }

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name])
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass)
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {}
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key]
          delete propsToPass[key]
        }
      }
    }
    resolveRouter = null
    return h(component, data, children)
  }
}

Vue.component('RouterView', View)

console.log(Vue.prototype)
console.log(Vue.prototype._routerRoot)

var toTypes = [String, Object]
var eventTypes = [String, Array]

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render(h) {
    // var this$1 = this
    console.log(this)

    // var router = this.$router
    // var current = this.$route
    // var ref = router.resolve(this.to, current, this.append)
    var ref = resolveRouterBak
    // var location = ref.location
    // var route = ref.route
    var href = ref.href

    var classes = {}
    // var globalActiveClass = null || router.options.linkActiveClass
    // var globalExactActiveClass = null || router.options.linkExactActiveClass
    // Support global empty active class
    // var activeClassFallback = globalActiveClass == null
    //   ? 'router-link-active'
    //   : globalActiveClass
    // var exactActiveClassFallback = globalExactActiveClass == null
    //   ? 'router-link-exact-active'
    //   : globalExactActiveClass
    // var activeClass = this.activeClass == null
    //   ? activeClassFallback
    //   : this.activeClass
    // var exactActiveClass = this.exactActiveClass == null
    //   ? exactActiveClassFallback
    //   : this.exactActiveClass
    // var compareTarget = location.path
    //   ? createRoute(null, location, null, router)
    //   : route

    // classes[exactActiveClass] = isSameRoute(current, compareTarget)
    // classes[activeClass] = this.exact
    //   ? classes[exactActiveClass]
    //   : isIncludedRoute(current, compareTarget)

    // var handler = function(e) {
    //   if (guardEvent(e)) {
    //     if (this$1.replace) {
    //       router.replace(location)
    //     } else {
    //       router.push(location)
    //     }
    //   }
    // }

    // var on = { click: guardEvent }
    // if (Array.isArray(this.event)) {
    //   this.event.forEach(function(e) { on[e] = handler })
    // } else {
    //   on[this.event] = handler
    // }

    var data = {
      class: classes
    }

    data.on = function() { console.log('路由跳转') }
    data.attrs = { href: href }

    // if (this.tag === 'a') {
    //   data.on = on
    //   data.attrs = { href: href }
    // } else {
    //   // find the first <a> child and apply listener and href
    //   var a = findAnchor(this.$slots.default)
    //   if (a) {
    //     // in case the <a> is a static node
    //     a.isStatic = false
    //     var aData = a.data = extend({}, a.data)
    //     aData.on = on
    //     var aAttrs = a.data.attrs = extend({}, a.data.attrs)
    //     aAttrs.href = href
    //   } else {
    //     // doesn't have <a> child, apply listener to self
    //     data.on = on
    //   }
    // }
    console.log(this.$slots.default)
    // return h(this.tag, data, this.$slots.default)
    return h(this.tag, data)
  }
}

Vue.component('RouterLink', Link)

function resolveProps(route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default: {
      warn(
        false,
        'props in \"' + (route.path) + '\" is a ' + (typeof config) + ', ' +
        'expecting an object, function or boolean.'
      )
    }
  }
}

function warn(condition, message) {
  if ('development' !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(('[vue-router] ' + message))
  }
}

function extend(a, b) {
  for (var key in b) {
    a[key] = b[key]
  }
  return a
}

// function createRoute(
//   record,
//   location,
//   redirectedFrom,
//   router
// ) {
//   var stringifyQuery$$1 = router && router.options.stringifyQuery

//   var query = location.query || {}
//   try {
//     query = clone(query)
//   } catch (e) {
//     console.log(e.message)
//   }

//   var route = {
//     name: location.name || (record && record.name),
//     meta: (record && record.meta) || {},
//     path: location.path || '/',
//     hash: location.hash || '',
//     query: query,
//     params: location.params || {},
//     fullPath: getFullPath(location, stringifyQuery$$1),
//     matched: record ? formatMatch(record) : []
//   }
//   if (redirectedFrom) {
//     route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1)
//   }
//   return Object.freeze(route)
// }

// function clone(value) {
//   if (Array.isArray(value)) {
//     return value.map(clone)
//   } else if (value && typeof value === 'object') {
//     var res = {}
//     for (var key in value) {
//       res[key] = clone(value[key])
//     }
//     return res
//   } else {
//     return value
//   }
// }

// function getFullPath(
//   ref,
//   _stringifyQuery
// ) {
//   var path = ref.path
//   var query = ref.query
//   if (query === void 0) query = {}
//   var hash = ref.hash
//   if (hash === void 0) hash = ''

//   var stringify = _stringifyQuery || stringifyQuery
//   return (path || '/') + stringify(query) + hash
// }

// function stringifyQuery(obj) {
//   var res = obj ? Object.keys(obj).map(function(key) {
//     var val = obj[key]

//     if (val === undefined) {
//       return ''
//     }

//     if (val === null) {
//       return encode(key)
//     }

//     if (Array.isArray(val)) {
//       var result = []
//       val.forEach(function(val2) {
//         if (val2 === undefined) {
//           return
//         }
//         if (val2 === null) {
//           result.push(encode(key))
//         } else {
//           result.push(encode(key) + '=' + encode(val2))
//         }
//       })
//       return result.join('&')
//     }

//     return encode(key) + '=' + encode(val)
//   }).filter(function(x) { return x.length > 0 }).join('&') : null
//   return res ? ('?' + res) : ''
// }

// var encodeReserveRE = /[!'()*]/g
// function encodeReserveReplacer(c) {
//   return '%' + c.charCodeAt(0).toString(16)
// }
// var commaRE = /%2C/g
// var START = createRoute(null, {
//   path: '/'
// })
// var trailingSlashRE = /\/?$/

// function encode(str) {
//   return encodeURIComponent(str)
//     .replace(encodeReserveRE, encodeReserveReplacer)
//     .replace(commaRE, ',')
// }

// function formatMatch(record) {
//   var res = []
//   while (record) {
//     res.unshift(record)
//     record = record.parent
//   }
//   return res
// }

// function isSameRoute(a, b) {
//   if (b === START) {
//     return a === b
//   } else if (!b) {
//     return false
//   } else if (a.path && b.path) {
//     return (
//       a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
//       a.hash === b.hash &&
//       isObjectEqual(a.query, b.query)
//     )
//   } else if (a.name && b.name) {
//     return (
//       a.name === b.name &&
//       a.hash === b.hash &&
//       isObjectEqual(a.query, b.query) &&
//       isObjectEqual(a.params, b.params)
//     )
//   } else {
//     return false
//   }
// }

// function isObjectEqual(a, b) {
//   if (a === void 0) a = {}
//   if (b === void 0) b = {}

//   // handle null value #1566
//   if (!a || !b) { return a === b }
//   var aKeys = Object.keys(a)
//   var bKeys = Object.keys(b)
//   if (aKeys.length !== bKeys.length) {
//     return false
//   }
//   return aKeys.every(function(key) {
//     var aVal = a[key]
//     var bVal = b[key]
//     // check nested equality
//     if (typeof aVal === 'object' && typeof bVal === 'object') {
//       return isObjectEqual(aVal, bVal)
//     }
//     return String(aVal) === String(bVal)
//   })
// }

// function isIncludedRoute(current, target) {
//   return (
//     current.path.replace(trailingSlashRE, '/').indexOf(
//       target.path.replace(trailingSlashRE, '/')
//     ) === 0 &&
//     (!target.hash || current.hash === target.hash) &&
//     queryIncludes(current.query, target.query)
//   )
// }

// function queryIncludes(current, target) {
//   for (var key in target) {
//     if (!(key in current)) {
//       return false
//     }
//   }
//   return true
// }

// function guardEvent(e) {
//   // don't redirect with control keys
//   if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
//   // don't redirect when preventDefault called
//   if (e.defaultPrevented) { return }
//   // don't redirect on right click
//   if (e.button !== undefined && e.button !== 0) { return }
//   // don't redirect if `target="_blank"`
//   if (e.currentTarget && e.currentTarget.getAttribute) {
//     var target = e.currentTarget.getAttribute('target')
//     if (/\b_blank\b/i.test(target)) { return }
//   }
//   // this may be a Weex event which doesn't have this method
//   if (e.preventDefault) {
//     e.preventDefault()
//   }
//   return true
// }

// function findAnchor(children) {
//   if (children) {
//     var child
//     for (var i = 0; i < children.length; i++) {
//       child = children[i]
//       if (child.tag === 'a') {
//         return child
//       }
//       if (child.children && (child = findAnchor(child.children))) {
//         return child
//       }
//     }
//   }
// }

new Vue({
  el: '#app',
  // router,
  store,
  render: h => h(App)
})
