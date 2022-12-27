# Vue Router

## 路由模式

### HTML5 

```js
export declare function createWebHistory(base?: string): RouterHistory
createWebHistory() // 没有 base，应用托管在域名 `https://example.com` 的根目录下。
createWebHistory('/folder/') // 给出的网址为 `https://example.com/folder/`
```

### hash

```js
// at https://example.com/folder
createWebHashHistory() // 给出的网址为 `https://example.com/folder#`
createWebHashHistory('/folder/') // 给出的网址为 `https://example.com/folder/#`
// 如果在 base 中提供了 `#`，则它不会被 `createWebHashHistory` 添加
createWebHashHistory('/folder/#/app/') // 给出的网址为 `https://example.com/folder/#/app/`
// 你应该避免这样做，因为它会更改原始 url 并打断正在复制的 url
createWebHashHistory('/other-folder/') // 给出的网址为 `https://example.com/other-folder/#`

// at file:///usr/etc/folder/index.html
// 对于没有 `host` 的位置，base被忽略
createWebHashHistory('/iAmIgnored') // 给出的网址为 `file:///usr/etc/folder/index.html#`
```

从以上的结果分析，其实路由模式可以不用考虑

## 路由方式

### router-link 标签

```vue
<router-link to="/">Go to Home</router-link>
<router-link to="/about">Go to About</router-link>
```

##路径匹配

### 路径path  正则re  组件 component 的对应关系

> 这里面尚需要注意一下 redirect children alias
>
> 应该不需要考虑是 H5 还是 hash 模式

```js
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

const mather = createRouterMatcher(routes, {
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

console.log(mather.getRoutes())  // mather.getRoutes().map(routeMatcher => routeMatcher.record) ==> router.getRoutes()
console.log(router.getRoutes())

mather.getRoutes() 的结构为数组 []，其中数组中，每个对象的属性为
[
    {
        alias: []  // 路由别名
    	children：[] // 嵌套路由的子路由信息
        keys: []
        parent: {}  // 嵌套路由的父路由信息
    	re: Regex  // 正则信息
    	record: {
    		aliasOf: {}  // 属于某一路由的别名
    		...
    	}
    	score: [] // 路由分值
    }
]
```

### 动态路由匹配

```js
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
// 像 /users/johnny 和 /users/jolyne 这样的 URL 都会映射到该路由
```

```js
const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

#### 参数中自定义正则

想象一下，两个路由 `/:orderId` 和 `/:productName`，两者会匹配完全相同的 URL，所以我们需要一种方法来区分它们 

```js
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```

现在，转到 `/25` 将匹配 `/:orderId`，其他情况将会匹配 `/:productName`。`routes` **数组的顺序并不重要!** 

------

注释和空格都给去掉

## 路由跳转方式

1、声明式跳转

```vue
<router-link to="/about">Go to About</router-link>
```

2、resolve 方法

```js
// 给定 { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 产生 /
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// 产生 /a/b

// 给定 { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 抛出错误，因为 `chapters` 为空

// router.resolve 返回的结果对象中有一个数组类型的属性 matched： 可以得到匹配到的路径信息
```

3、sensitive 与 strict 路由配置

```
给定 { path: '/users/:id', sensitive: true }
将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true （是否考虑末尾的 /）
    // - /Users/posva 当 sensitive: true (是否考虑大小写)
    
可以在 createRouterMatcher 中返回的正则表达式中有所体现，不必在意
```

4、router

```js
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

