import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as vue from 'vue'
// import { parse, compileStyleAsync } from '@vue/compiler-sfc'

const vid = vue.default ? 2 : 3

const app = createApp(App)

app.use(router)

// app.mount('#app')

console.log(router)

// console.log(JSON.stringify(app.config.globalProperties))

let $route = { path: "/kofs/dasd/dadka"}

console.log('resolve', router.resolve("/kofs/dasd/dadka"))

$route = Object.assign($route, router.resolve("/kofs/dasd/dadka"))

const vm = { $route }

console.log(router.getRoutes())

console.log(router.options.routes)


// console.log(router.getRoutes()[5])

// console.table(router.getRoutes()[5].components.default)
// console.table(router.getRoutes()[5].components.default())

// router.getRoutes()[5].components.default().then(data => console.log(data))

const data = router.getRoutes()[5].components.default.data.call(vm)

// console.log('data', data)

// _sfc_render(_ctx, _cache, $props, $setup, $data, $options)

let tVnode = router.getRoutes()[5].components.default.render.call(vm, vm, [], {test: '传入'}, null, data, null)

let childVNode = router.getRoutes()[5].components.default.components.Home.render.call(vm, vm, [], {test: '传入'}, null, data, null)

// console.table(router.getRoutes()[5].components.default.components.HelloWorld.render)
// console.table(router.getRoutes()[5].components.default.components.HelloWorld.setup(null, {expose: () => { console.log('33') }}))

// console.log(parse(router.getRoutes()[5].components.default.components.HelloWorld.__file))

// const desc = parse(router.getRoutes()[5].components.default.components.HelloWorld.__file)
// console.log(compileStyleAsync({ filename: router.getRoutes()[5].components.default.components.HelloWorld.__file, id: router.getRoutes()[5].components.default.components.HelloWorld.__hmrId }))
// compileStyleAsync({ filename: router.getRoutes()[5].components.default.components.HelloWorld.__file, id: router.getRoutes()[5].components.default.components.HelloWorld.__hmrId }).then(data => console.log(data))

const setup = router.getRoutes()[5].components.default.components.HelloWorld.setup(null, {expose: () => { console.log('33') }})

console.table(router.getRoutes()[5].components.default.components.HelloWorld.render)

let childVNode_2 = router.getRoutes()[5].components.default.components.HelloWorld.render.call(vm, vm, [], {test: '传入'}, setup, data, null)

console.log('vnode', tVnode)

console.log('childVNode', childVNode)
console.log('childVNode_2', childVNode_2)

// 渲染器的工作：将虚拟DOM渲染成真实的DOM，然后挂载到页面上
/**
 * vnode：js对象的dom节点
 * container：指定挂载的容器
 * */
const mount = (vnode, container) => {
  // 1. 处理vnode的tag，生成真实的dom元素，并用vnode的el属性保存
  // console.log(vnode)
  let el
  if (typeof vnode.type === 'string'){
    el = document.createElement(vnode.type)
    if ("scopeId" in vnode && vnode["scopeId"]) {
      el.setAttribute(vnode["scopeId"], '')
    }
  } else
    el = document.createDocumentFragment()
  // 2. 处理vnode的props
  for (const key in vnode.props) {
    const value = vnode.props[key];
    // 假如props传来的是onClick之类的事件
    if (key.startsWith("on")) {
      // .slice(startIndex, endIndex)，end不写默认到最后，拿到切割后的值，表示从哪里切到哪里
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "style") {
      let styleStr = ''
      Object.entries(vnode.props["style"]).forEach((item) => {
        styleStr += `${item[0]}: ${item[1]};`
      })
      el.setAttribute('style', styleStr)
    } else {
      el.setAttribute(key, value);
    }
  }

  // 3. 处理vnode的children
  // 如果是文本，就直接设置文本内容
  if (typeof vnode.children === "string") {
    el.innerHTML += vnode.children;
  } else if (Array.isArray(vnode.children)) {
    // 如果有子元素，遍历递归调用
    vnode.children.forEach((item) => {
      // mount(item, el);
      if (item.type === 'home') {
        mount(childVNode, el);
      } else if (item.type === 'hello-world') {
        mount(childVNode_2, el);
      } 
      else if (typeof item.type === 'symbol' && String(item.type).indexOf('Text') !== -1) {
        el.innerHTML += item.children;
      } else {
        // 子元素是挂载到el上的
        mount(item, el);
      }
    });
  }

  // 最后，将el挂载到container上
  container.appendChild(el);
}

mount(tVnode, document.querySelector('#app'))
