<script setup>
 
</script>

<template>
  <div>
    <!-- <div v-for="item in params.afterUser">{{item}}</div> -->
    <div>路由匹配：'/user-:afterUser(.*)'</div>
    <div>路由地址：{{ this.$route.path }}</div>
    <div>afterUser： {{ JSON.stringify(params.afterUser)}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      
    },
    computed: {
      params() { // 这个 params 要写到 computed 里面，不能写在 data 里，不然 $route 发生变化而params不会跟随刷新
        return this.$route.params
      }
    },
    components: {
      
    }
  }
</script>
 
<style scoped>
 
</style>