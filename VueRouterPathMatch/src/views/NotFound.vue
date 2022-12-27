<script setup>
 
</script>

<template>
  <div>
    <div class="colorcc">路由匹配：'/:pathMatch(.*)*'</div>
    <div>路由地址：{{ $route.path }}</div>
    <div>pathMatch：{{ JSON.stringify(params.pathMatch)}}</div>
    <div>props: {{ test }}</div>
    <home></home>
    <hello-world></hello-world>
  </div>
</template>
<script>
  import Home from './Home.vue'
  import HelloWorld from '../components/HelloWorld.vue';
  export default {
    props: {
      test: {
        type: String,
        default: 'test'
      }
    },
    data() {
      return {
        params: this.$route.params
      }
    },
    methods: {
      
    },
    components: {
      Home,
      HelloWorld
    }
  }
</script>
 
<style scoped>
.colorcc {
  color: #ccc;
}
</style>