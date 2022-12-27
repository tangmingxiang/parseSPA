<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { parse,compileTemplate,compileScript,compileStyleAsync } from '@vue/compiler-sfc'

let code = `
<template>
  <div>
    <div>路由匹配：'/:pathMatch(.*)*'</div>
    <div>路由地址：{{ this.$route.path }}</div>
    <div>pathMatch：{{ JSON.stringify(params.pathMatch)}}</div>
  </div>
</template>
<style scoped>
</style>`

const descriptor = parse(code)
console.log(descriptor)

const compiledScript = compileScript(descriptor)
console.log(compiledScript)


</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

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
