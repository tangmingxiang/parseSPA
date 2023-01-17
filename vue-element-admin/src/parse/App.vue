<template>
  <div id="app">
    <path-list />
  </div>
</template>

<script>
import router from '../router'
import PathList from './components/PathList.vue'
export default {
  name: 'App',
  components: {
    PathList
  },
  data() {
    return {
      // hash: '/dashboard'
    }
  },
  created() {
    this._routerRoot = { _router: router }
    // console.log(this.$router)
    // console.log(this.$routes)
  }
  // watch: {
  //   hash: {
  //     handler(newVal) {
  //       console.log(11)
  //       this._routerRoot._router = router
  //       const resolveRouter = this.$router.resolve(newVal)
  //       this._route = resolveRouter.route
  //       this._routePath = newVal
  //     },
  //     immediate: true
  //   }
  // }
}
</script>
