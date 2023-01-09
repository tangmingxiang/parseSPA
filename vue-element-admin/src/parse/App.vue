<template>
  <div id="app">
    <!-- <input v-model="hash" type="text"> -->
    <router-view />
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'App',
  data() {
    return {
      hash: '/dashboard'
    }
  },
  watch: {
    hash: {
      handler(newVal) {
        // console.log(11)
        this._routerRoot._router = router
        const resolveRouter = this.$router.resolve(newVal)
        this._route = resolveRouter.route
        this._routePath = newVal
      },
      immediate: true
    }
  }
}
</script>
