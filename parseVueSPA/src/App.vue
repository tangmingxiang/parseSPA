<script setup>
import FileInput from './components/FileInput.vue'
</script>

<template>
  <div>
    <button id="file" @click="getFile">选择</button>
    <input type="file" id="router" name="router" accept="text/javascript" @change="fileChange" />
    <button @click="parse">解析</button>
  </div>
</template>

<script>
const pickerOpts = {
  types: [
    {
      description: 'js',
      accept: {
        'text/javascript': ['.js']
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false
}
import { createWebHistory, createWebHashHistory, createRouterMatcher } from 'vue-router'
export default {
  data() {
    return {
      file: null
    }
  },
  methods: {
    async getFile() {
      // open file picker, destructure the one element returned array
      let [fileHandle] = await window.showOpenFilePicker(pickerOpts)
      console.log(fileHandle)
      const content = await fileHandle.getFile()
      console.log(await content.text())
      // run code with our fileHandle
    },
    fileChange($event) {
      console.log($event.target.files[0])
    },
    async parse() {
      const cc = await import('C:/Users/fli/Desktop/开源-自研/parseSPA/VueRouterPathMatch/src/router/index.js')
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
