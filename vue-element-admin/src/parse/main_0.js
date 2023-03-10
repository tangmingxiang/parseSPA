import router from '../router'
import * as vue from 'vue'
// import { createWebHistory, createWebHashHistory, createRouterMatcher } from './router@4.js'
import { createWebHashHistory, createRouterMatcher } from './router@4.js'
import $store from '../store'

// console.log(router)
// console.log(new vue['default']())
// console.log(new vue['default']())
// console.log(vue)

// const routes = (router.getRoutes && router.getRoutes()) || router.options.routes
const routes = router.options.routes
console.log(routes)

const dd = createRouterMatcher(routes, {
  history: createWebHashHistory(),
  routes
})
console.log(dd.getRoutes())

function getVid() {
  return vue.default ? 2 : 3
}

async function getComponent(component) {
  if (typeof component === 'function') {
    const comp = await component()
    return comp
  }
  return component
}

function createVM(component) {
  const vid = getVid()
  const resultVM = { }
  if ('mixins' in component) {
    component['mixins'].forEach(item => {
      Object.assign(resultVM, createVM(item))
    })
  } else if (!resultVM.$store) {
    if (vid === 2) {
      const Vue = vue.default
      const tempObj = {
        $store,
        $router: router.resolve({ path: '/redirect' }),
        $route: router.resolve({ path: '/redirect' }).route,
        $createElement: new Vue().$createElement,
        _self: { },
        _e: function() { console.log('_e') }
      }
      Object.assign(resultVM, tempObj)
    } else {
      Object.assign(resultVM, { $store })
    }
  }
  if ('props' in component) {
    const tempObj = {}
    Object.keys(component['props']).forEach(key => {
      if ('default' in component['props'][key]) {
        tempObj[key] = typeof component['props'][key]['default'] === 'function' ? component['props'][key]['default']() : component['props'][key]['default']
      }
    })
    Object.assign(resultVM, tempObj)
  }
  if ('data' in component) {
    const data = component.data()
    Object.assign(resultVM, data)
  }
  if ('components' in component) {
    const tempObj = {}
    Object.keys(component['components']).forEach(async key => {
      tempObj[key] = {}
      tempObj[key]['component'] = await getComponent(component['components'][key])
      tempObj[key]['VM'] = createVM(tempObj[key]['component'])
    })
    Object.assign(resultVM, { 'components': tempObj })
  }
  if ('computed' in component) {
    Object.keys(component['computed']).forEach(key => {
      try {
        if (typeof component['computed'][key] === 'function') {
          resultVM[key] = component['computed'][key].call(resultVM)
        } else {
          resultVM[key] = component['computed'][key]['get'].call(resultVM)
        }
      } catch (e) {
        console.log(e.message)
      }
    })
  }
  if ('methods' in component) {
    Object.keys(component['methods']).forEach(key => {
      resultVM[key] = component['methods'][key].bind(resultVM)
    })
  }
  if ('watch' in component) {
    // TODO
    console.log('watch TODO')
  }
  /** ?????????????????? */
  const lifeCycleFunction = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeUnMount', 'unmounted', 'beforeDestroy', 'destoryed']
  lifeCycleFunction.forEach(key => {
    if (key in component) {
      if (!(key in resultVM)) {
        resultVM[key] = []
      }
      const keyLen = resultVM[key].length
      if (typeof component[key] === 'function') {
        resultVM[key][keyLen] = component[key].bind(resultVM)
      } else {
        component[key].forEach((item, index) => {
          resultVM[key][keyLen + index] = item.bind(resultVM)
        })
      }
    }
  })
  /** ?????????????????? */
  return resultVM
}

/** test */
(async function test() {
  const comp1 = await getComponent(routes[0].component)
  console.log(comp1)
  // console.table(comp1.beforeCreate[0])
  const vm = createVM(comp1)
  console.log('vm', vm)
  console.table('render', comp1.render)
  console.table('props_render', comp1.components.RightPanel.render)
  console.table('vNode', comp1.render.call(vm))
})()
/** test */

// const mount = (vnode, container) => {
//   // 1. ??????vnode???tag??????????????????dom???????????????vnode???el????????????
//   // console.log(vnode)
//   let el
//   if (typeof vnode.type === 'string') {
//     el = document.createElement(vnode.type)
//     if ('scopeId' in vnode && vnode['scopeId']) {
//       el.setAttribute(vnode['scopeId'], '')
//     }
//   } else {
//     el = document.createDocumentFragment()
//   }
//   // 2. ??????vnode???props
//   for (const key in vnode.props) {
//     const value = vnode.props[key]
//     // ??????props????????????onClick???????????????
//     if (key.startsWith('on')) {
//       // .slice(startIndex, endIndex)???end???????????????????????????????????????????????????????????????????????????
//       el.addEventListener(key.slice(2).toLowerCase(), value)
//     } else if (key === 'style') {
//       let styleStr = ''
//       Object.entries(vnode.props['style']).forEach((item) => {
//         styleStr += `${item[0]}: ${item[1]};`
//       })
//       el.setAttribute('style', styleStr)
//     } else {
//       el.setAttribute(key, value)
//     }
//   }
//   // 3. ??????vnode???children
//   // ?????????????????????????????????????????????
//   if (typeof vnode.children === 'string') {
//     el.innerHTML += vnode.children
//   } else if (Array.isArray(vnode.children)) {
//     // ???????????????????????????????????????
//     vnode.children.forEach((item) => {
//       // mount(item, el);
//       if (item.type === 'home') {
//         mount(childVNode, el)
//       } else if (item.type === 'hello-world') {
//         mount(childVNode_2, el)
//       } else if (typeof item.type === 'symbol' && String(item.type).indexOf('Text') !== -1) {
//         el.innerHTML += item.children
//       } else {
//         // ?????????????????????el??????
//         mount(item, el)
//       }
//     })
//   }
//   // ????????????el?????????container???
//   container.appendChild(el)
// }

// mount(tVnode, document.querySelector('#app'))
