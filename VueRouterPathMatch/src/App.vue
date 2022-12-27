<script setup>
import { useRouter } from 'vue-router'
console.log(JSON.stringify(useRouter().getRoutes()[5].components.default))
</script>

<template>
  <div>
    <div class="head">
      <router-link to="/">Home</router-link>
      <router-link to="/user-098/user-pok">UserGeneric</router-link>
      <router-link to="/kofs/dasd/dadka">Not Found</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  width: 400px;
}
</style>
