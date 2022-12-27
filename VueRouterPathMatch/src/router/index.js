import { createRouter, createWebHistory, createWebHashHistory, createRouterMatcher } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import UserGeneric from '../views/UserGeneric.vue'
import UserGenerics from '../views/UserGenerics.vue'

const routes = [
  { path: '/', alias: '/home', component: Home },
  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/user-:afterUser(.*)', component: UserGeneric },
  { path: '/users/user-:afterUser(.*)', component: UserGeneric },
  { path: '/user-:afterUser(.*)*', component: UserGenerics },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

// console.log(router.getRoutes())


// const mather = createRouterMatcher(routes, {
//   // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
//   history: createWebHashHistory(),
//   routes, // `routes: routes` 的缩写
// })

// console.log(mather.getRoutes())
// console.log(router.getRoutes())
// console.log(router.resolve("/kofs/dasd/dadka"))

// console.log(router.getRoutes()[5].components.default.render().call({$route: {}}))
// const rous = mather.getRoutes()
// console.log(rous[3])
// console.log(rous[3].parse('/kofs/dasd/dadka'));

export default router
