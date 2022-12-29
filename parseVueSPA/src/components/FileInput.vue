<script setup>

</script>

<template>
  <button id="directory" @click="readDir"></button>
</template>

<script>
import { isExist } from '../util'
// const no = await isExist('../../test.js')
// const yes = await isExist('../../package.json')
// console.log(no)
// console.log(yes)
export default{
  data() {
    return {
      
    }
  },
  methods: {
    async handleDirectory(dirHandle) {
      const content = {}
      if (dirHandle instanceof FileSystemDirectoryHandle) {
        const file = dirHandle.values()
        const v = file
        let value = await v.next()
        while (!value.done) {
          if (value.value instanceof FileSystemDirectoryHandle) {
            content[value.value.name] = await this.handleDirectory(value.value)
          } else {
            content[value.value.name] = value.value
          }
          value = await v.next()
        }
      }
      return content
    },
    async readDir() {
      const dirHandle = await window.showDirectoryPicker()
      const content = await this.handleDirectory(dirHandle)
      console.log(content)
    }
  }
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
