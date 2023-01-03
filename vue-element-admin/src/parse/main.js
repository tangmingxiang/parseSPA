import router from '../router'
import * as vue from 'vue'
// import { createWebHistory, createWebHashHistory, createRouterMatcher } from './router@4.js'
import { createWebHashHistory, createRouterMatcher } from './router@4.js'
import $store from '../store'

// console.log(router)
// console.log(new vue['default']())

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
        $createElement: new Vue().$createElement,
        _self: { },
        _e: function() { console.log('_e') }
      }
      Object.assign(resultVM, tempObj)
    } else {
      Object.assign(resultVM, { $store })
    }
  }
  if ('data' in component) {
    const data = component.data()
    Object.assign(resultVM, data)
  }
  if ('computed' in component) {
    Object.keys(component['computed']).forEach(key => {
      resultVM[key] = component['computed'][key].call(resultVM)
    })
  }
  if ('methods' in component) {
    Object.keys(component['methods']).forEach(key => {
      resultVM[key] = component['methods'][key].bind(resultVM)
    })
  }
  /** 生命周期函数 */
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
  /** 生命周期函数 */
  return resultVM
}

/** test */
(async function test() {
  const comp1 = await getComponent(routes[0].component)
  console.log(comp1)
  const vm = createVM(comp1)
  console.log('vm', vm)
  console.table('render', comp1.render)
  console.table('vNode', comp1.render.call(vm))
})()
/** test */

// const mount = (vnode, container) => {
//   // 1. 处理vnode的tag，生成真实的dom元素，并用vnode的el属性保存
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
//   // 2. 处理vnode的props
//   for (const key in vnode.props) {
//     const value = vnode.props[key]
//     // 假如props传来的是onClick之类的事件
//     if (key.startsWith('on')) {
//       // .slice(startIndex, endIndex)，end不写默认到最后，拿到切割后的值，表示从哪里切到哪里
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
//   // 3. 处理vnode的children
//   // 如果是文本，就直接设置文本内容
//   if (typeof vnode.children === 'string') {
//     el.innerHTML += vnode.children
//   } else if (Array.isArray(vnode.children)) {
//     // 如果有子元素，遍历递归调用
//     vnode.children.forEach((item) => {
//       // mount(item, el);
//       if (item.type === 'home') {
//         mount(childVNode, el)
//       } else if (item.type === 'hello-world') {
//         mount(childVNode_2, el)
//       } else if (typeof item.type === 'symbol' && String(item.type).indexOf('Text') !== -1) {
//         el.innerHTML += item.children
//       } else {
//         // 子元素是挂载到el上的
//         mount(item, el)
//       }
//     })
//   }
//   // 最后，将el挂载到container上
//   container.appendChild(el)
// }

// mount(tVnode, document.querySelector('#app'))
