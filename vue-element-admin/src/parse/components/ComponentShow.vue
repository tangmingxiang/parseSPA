<template>
  <div id="container" />
</template>

<script>
import store from '../../store'
import router from '../../router'
import SourceMain from '../../sourceMain.js'
import App from '../../App.vue'
export default {
  props: {
    viewRoute: {
      type: Object,
      default: () => ({ path: '/' })
    },
    viewPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // vm: {}
    }
  },
  // computed: {
  //   test() {
  //     return this.vm
  //   }
  // },
  mounted() {
    const routes = router.options.routes
    this.viewRoute = routes[5]
    this.viewPath = this.viewRoute.path
    this.mountComponent(this.viewRoute.component, document.querySelector('#container'))
  },
  methods: {
    /**
     * 生命周期函数 beforeCreate 和 beforeDestory 数组中的最后一个函数应该与路由有关，不用执行
     * $refs 不好解决 $parent 会出现在 computed 里, Mounted 之前再处理一下
     */
    getVNode(component, vm_input, options, parent_vm) {
      // vm_input 为的是处理 mixins 的情况
      // options 用于处理父组件传来的 props 等
      // $parent 需要指向 parent_vm
      let vm = vm_input
      if (!vm) {
        const route = router.resolve(this.viewPath).route
        const _routerRoot = { _router: router, _route: route }
        vm = Object.create(new SourceMain({ store }))
        vm._routerRoot = _routerRoot
      }
      if (parent_vm) {
        vm.$parent = parent_vm
      }
      vm.$refs = {}
      if ('props' in component) {
        const props = component['props']
        // vm['props'] = {}
        for (const key in props) {
          const defaultValue = props[key].default
          if (defaultValue !== undefined) {
            vm[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue
            // vm['props'][key] = vm[key]
          }
        }
      }
      // if (options) {
      //   // todo 处理 options，譬如由父组件传入的数据
      //   console.log('options todo')
      // }
      if ('mixins' in component) {
        const mixins = component['mixins']
        mixins.forEach(comp => {
          this.getVNode(comp, vm)
        })
      }
      // beforeCreate 会在实例初始化完成、props 解析之后、data() 和 computed 等选项处理之前立即调用
      if ('beforeCreate' in component && component['beforeCreate'].length > 1) {
        const beforeCreate = component['beforeCreate'].slice(0, -1)
        beforeCreate.forEach(func => {
          func.call(vm)
        })
      }
      if ('data' in component) {
        const data = component['data']
        const dataResultTemp = typeof data === 'function' ? data.call(vm) : data
        Object.assign(vm._data, dataResultTemp)
      }
      if ('methods' in component) {
        const methods = component['methods']
        Object.keys(methods).forEach(key => {
          vm[key] = methods[key].bind(vm)
        })
      }
      if ('computed' in component) {
        const computed = component['computed']
        Object.keys(computed).forEach(key => {
          try {
            if (typeof computed[key] === 'function') {
              vm[key] = computed[key].call(vm)
            } else if (typeof computed[key] === 'object' && ('get' in computed[key])) {
              vm[key] = computed[key]['get'].call(vm)
            }
          } catch (e) {
            console.log(e.message)
            // 该计算属性用到了 $refs 需要后续处理
            vm[key] = {}
          }
        })
      }
      if ('components' in component) {
        const styleHyphenFormat = (propertyName) => {
          function upperToHyphenLower(match) {
            return '-' + match.toLowerCase()
          }
          const result = propertyName.replace(/[A-Z]/g, upperToHyphenLower)
          return result[0] === '-' ? result.slice(1) : result
        }
        const components = component['components']
        vm['components'] = vm['components'] ? vm['components'] : {}
        Object.keys(components).forEach(async key => {
          const hyphenKey = styleHyphenFormat(key)
          if (typeof components[key] === 'function') {
            vm['components'][hyphenKey] = await components[key]()
          } else {
            vm['components'][hyphenKey] = components[key]
          }
          // vm['components'][hyphenKey] = this.getVNode(vm['components'][hyphenKey])
        })
      }
      if ('render' in component) {
        const vNode = component['render'].call(vm, null, vm)
        return { vm, vNode }
      }
      return {}
    },
    mountComponent(component, container, options, parent_vm) {
      if (true) {
        const route = router.resolve(this.viewPath).route
        // const _routerRoot = { _router: router, _route: route }
        // let childView = this.viewRoute.children[0].component
        let childView = this.viewRoute.component
        // let childView = this.viewRoute.component.components.TagsView
        let cnt = 1
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
            console.log('<router-view></router-view>')
            var parent = ref.parent
            var h = parent.$createElement
            if (cnt > 1) {
              cnt--
              return h(childView)
            } else {
              return h('div')
            }
            // return h(childView)
          }
        }
        // SourceMain.component('RouterView', View)
        // const vm = Object.create(new SourceMain({ store, router, render: h => h(component) }))
        const vm = Object.create(new SourceMain({ store, router, render: h => h(App) }))
        vm._routerRoot._route = route
        function next(to) {
          console.log(to)
          // if (to === false || isError(to)) {
          //   // next(false) -> abort navigation, ensure current URL
          //   this$1.ensureURL(true);
          //   abort(to);
          // } else if (
          //   typeof to === 'string' ||
          //   (typeof to === 'object' && (
          //     typeof to.path === 'string' ||
          //     typeof to.name === 'string'
          //   ))
          // ) {
          //   // next('/') or next({ path: '/' }) -> redirect
          //   abort();
          //   if (typeof to === 'object' && to.replace) {
          //     this$1.replace(to);
          //   } else {
          //     this$1.push(to);
          //   }
          // } else {
          //   // confirm transition and pass on the value
          //   next(to);
          // }
        }
        // 单纯的刷新浏览器 不会触发 beforeHooks 的执行 ? 触发了
        // router.beforeHooks.forEach(item => {
        //   console.log('router beforeHooks1111111')
        //   item(route, null, next)
        // })
        document.querySelector('#container').appendChild(vm.$mount().$el)
        // router.afterHooks.forEach(item => {
        //   item(route)
        // })
      }
      // console.log(component)
      // const { vm, vNode } = this.getVNode(component, null, options, parent_vm)
      // console.log(document.querySelector('#container'))
      // vm.$mount('#container')
      // // console.log(vm)
      // console.log(vNode)
      // if (!vNode || !vNode.tag) {
      //   return
      // }
      // // 1.处理 vNode 的 tag，生成真实的 dom 元素，并用 vNode 的 el 属性保存
      // const el = document.createElement(vNode.tag)
      // if (component['_scopeId']) {
      //   el.setAttribute(component['_scopeId'], '')
      // }
      // // 2.处理类名
      // if (vNode.data) {
      //   let classStr = 'staticClass' in vNode.data ? vNode.data.staticClass : ''
      //   if ('class' in vNode.data) {
      //     for (const classKey in vNode.data.class) {
      //       if (vNode.data.class[classKey]) {
      //         classStr += ` ${classKey}`
      //       }
      //     }
      //   }
      //   if (classStr) {
      //     el.setAttribute('class', classStr)
      //   }
      // }
      // // 2. 处理vnode的props
      // // for (const key in vnode.props) {
      // //   const value = vnode.props[key]
      // //   // 假如props传来的是onClick之类的事件
      // //   if (key.startsWith("on")) {
      // //     // .slice(startIndex, endIndex)，end不写默认到最后，拿到切割后的值，表示从哪里切到哪里
      // //     el.addEventListener(key.slice(2).toLowerCase(), value)
      // //   } else if (key === "style") {
      // //     let styleStr = ''
      // //     Object.entries(vnode.props["style"]).forEach((item) => {
      // //       styleStr += `${item[0]}: ${item[1]}`
      // //     })
      // //     el.setAttribute('style', styleStr)
      // //   } else {
      // //     el.setAttribute(key, value)
      // //   }
      // // }

      // // 3. 处理 vNode 的 children
      // const children = vNode.children
      // if (children) {
      //   children.forEach((item) => {
      //     // 3.1 纯文本节点的情况
      //     if (!item.tag && item.text) {
      //       el.innerHTML += item.text
      //       return
      //     }
      //     // 既无文本也无标签
      //     if (!item.tag) {
      //       return
      //     }
      //     let childEl = null
      //     // 3.2 节点为组件的情况
      //     if (item.tag in vm.components) {
      //       const options = 'attrs' in item.data ? item.data.attrs : null
      //       childEl = this.mountComponent(vm.components[item.tag], el, options, vm)
      //     }
      //     else if (item.tag && item.tag.startsWith('vue-component-') && item.componentOptions) {
      //       // 3.3 节点为 vue 原生组件或第三方组件
      //       console.log(vm)
      //       // console.log(vm.$ElEMENT)
      //       console.table(vm.$mount)
      //       // console.log(vNode)
      //       // console.log(vm._init)
      //       // console.log(item)
      //       console.log(item.componentOptions.Ctor)
      //       console.log(item.context._init)
      //       item.context.$options.el = el
      //       console.log('1111111111111111111111111111111111111111111111111')
      //       console.table(item.componentOptions.Ctor.call(item.context, item.componentOptions))
      //       console.log(el)
      //     } 
      //     else {
      //       // 3.4 节点为普通 HTML 标签
      //       childEl = this.mountVNode(item, el, vm)
      //     }
      //     if (item.data && 'ref' in item.data) {
      //       vm.$refs[item.data['ref']] = childEl
      //     }
      //   })
      // }
      // // 最后，将el挂载到container上
      // container.appendChild(el)
      // return el
    },
    mountVNode(vNode, parent, vm) {
      // 1.生成 dom 节点
      const el = document.createElement(vNode.tag)
      // 2.处理类名
      if (vNode.data) {
        let classStr = 'staticClass' in vNode.data ? vNode.data.staticClass : ''
        if ('class' in vNode.data) {
          for (const classKey in vNode.data.class) {
            if (vNode.data.class[classKey]) {
              classStr += ` ${classKey}`
            }
          }
        }
        if (classStr) {
          el.setAttribute('class', classStr)
        }
      }
      // 3. 处理 vNode 的 children
      const children = vNode.children
      if (children) {
        children.forEach((item) => {
          // 3.1 纯文本节点的情况
          if (!item.tag && item.text) {
            el.innerHTML += item.text
            return
          }
          // 3.2 节点为组件的情况
          if (item.tag in vm.components) {
            // todo
            const options = {}

            return
          }
          // 3.3 节点为普通 HTML 标签
          this.mountVNode(item, el, vm)
        })
      }
      // 最后，将el挂载到container上
      parent.appendChild(el)
      return el
    }
  }
}
</script>

<style scoped>
#container {
  min-height: 800px
}
</style>
