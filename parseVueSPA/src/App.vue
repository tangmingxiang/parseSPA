<script setup>
import FileInput from './components/FileInput.vue'
</script>

<template>
  <div>
    <!-- <button id="file" @click="getFile">选择</button> -->
    <!-- <input type="file" id="router" name="router" accept="text/javascript" @change="fileChange" /> -->
    <input type="text" id="router" name="router" v-model="routerPath" />
    <button @click="parse">解析</button>
  </div>
</template>

<script>
import { createWebHistory, createWebHashHistory, createRouterMatcher } from 'vue-router'
// import { routerPath } from '../parse-vue-spa.js'
export default {
  // data() {
  //   return {
  //     routerPath: null
  //   }
  // },
  methods: {
    async parse() {
      // const cc = await import('../../VueRouterPathMatch/src/router')
      const cc = await import('../../../vue-element-admin/src/router/index.js')
      // const cc = await import('D:/开源-自研/vue-element-admin/src/router/index.js')
      console.log(cc.default)
      console.log(cc.default.getRoutes())
      const dd = createRouterMatcher(cc.default.getRoutes(), {
        history: createWebHashHistory(),
        routes: cc.default.getRoutes(), // `routes: routes` 的缩写
      })
      console.log(dd)
      console.log(dd.getRoutes())
    }
  }
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
