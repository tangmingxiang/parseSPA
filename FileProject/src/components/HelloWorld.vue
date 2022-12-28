<script setup>

</script>

<template>
  <button id="file">选择</button>
  <button id="directory">选择目录</button>
</template>

<script>
export default{
  mounted() {
    const pickerOpts = {
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
            'application/*': ['.json', '.vue']
          }
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false
    };
    let fileHandle;
    document.querySelector('#file').addEventListener('click', async function getFile() {
      // open file picker, destructure the one element returned array
      [fileHandle] = await window.showOpenFilePicker(pickerOpts)
      const content = await fileHandle.getFile()
      console.log(await content.text())
      // run code with our fileHandle
    })
    document.querySelector('#directory').addEventListener('click', async function getFile() {
      // open file picker, destructure the one element returned array
      const dirHandle = await window.showDirectoryPicker()
      // console.log(dirHandle)
      // console.log(dirHandle instanceof FileSystemDirectoryHandle)
      // const content = []
      // const dir = dirHandle.entries()
      // const file = dirHandle.values()
      // const v = file
      // let value = await v.next()
      // while (!value.done) {
      //   content.push(value.value)
      //   value =  await v.next()
      // }
      // console.log(content)
      const content = await handleDirectory(dirHandle)
      console.log(content)
    })
    async function handleDirectory(dirHandle) {
      const content = {}
      if (dirHandle instanceof FileSystemDirectoryHandle) {
        const file = dirHandle.values()
        const v = file
        let value = await v.next()
        while (!value.done) {
          if (value.value instanceof FileSystemDirectoryHandle) {
            content[value.value.name] = await handleDirectory(value.value)
          } else {
            content[value.value.name] = value.value
          }
          value = await v.next()
        }
      }
      return content
    }
  }
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
