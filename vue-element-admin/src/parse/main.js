import router from '../router'
import * as vue from 'vue'
// import { createWebHistory, createWebHashHistory, createRouterMatcher } from './router@4.js'
import { createWebHashHistory, createRouterMatcher } from './router@4.js'

const vid = vue.default ? 2 : 3
console.log(vid)

const routes = (router.getRoutes && router.getRoutes()) || router.options.routes
console.log(routes)

const dd = createRouterMatcher(routes, {
  history: createWebHashHistory(),
  routes
})
console.log(dd.getRoutes())

async function getComponent(component) {
  if (typeof component === 'function') {
    const comp = await component()
    console.log(comp)
    console.table(comp.default.render)
  }
}

(async () => {
  getComponent(routes[1].component)
})()

const mount = (vnode, container) => {
  // 1. 处理vnode的tag，生成真实的dom元素，并用vnode的el属性保存
  // console.log(vnode)
  let el
  if (typeof vnode.type === 'string') {
    el = document.createElement(vnode.type)
    if ('scopeId' in vnode && vnode['scopeId']) {
      el.setAttribute(vnode['scopeId'], '')
    }
  } else {
    el = document.createDocumentFragment()
  }
  // 2. 处理vnode的props
  for (const key in vnode.props) {
    const value = vnode.props[key]
    // 假如props传来的是onClick之类的事件
    if (key.startsWith('on')) {
      // .slice(startIndex, endIndex)，end不写默认到最后，拿到切割后的值，表示从哪里切到哪里
      el.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key === 'style') {
      let styleStr = ''
      Object.entries(vnode.props['style']).forEach((item) => {
        styleStr += `${item[0]}: ${item[1]};`
      })
      el.setAttribute('style', styleStr)
    } else {
      el.setAttribute(key, value)
    }
  }
  // 3. 处理vnode的children
  // 如果是文本，就直接设置文本内容
  if (typeof vnode.children === 'string') {
    el.innerHTML += vnode.children
  } else if (Array.isArray(vnode.children)) {
    // 如果有子元素，遍历递归调用
    vnode.children.forEach((item) => {
      // mount(item, el);
      if (item.type === 'home') {
        mount(childVNode, el)
      } else if (item.type === 'hello-world') {
        mount(childVNode_2, el)
      } else if (typeof item.type === 'symbol' && String(item.type).indexOf('Text') !== -1) {
        el.innerHTML += item.children
      } else {
        // 子元素是挂载到el上的
        mount(item, el)
      }
    })
  }
  // 最后，将el挂载到container上
  container.appendChild(el)
}

// mount(tVnode, document.querySelector('#app'))
