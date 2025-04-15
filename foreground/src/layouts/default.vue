<template>
  <el-container class="h-full w-full" direction="horizontal">
    <Aside></Aside>
    <el-container direction="vertical">
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Header from './components/header.vue'
import Aside from './components/aside.vue'
import Main from './components/main.vue'
import Footer from './components/footer.vue'
</script>
<style scoped></style>
