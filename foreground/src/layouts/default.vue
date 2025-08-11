<!--
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 09:45:18
 * @FilePath: /node-qb/foreground/src/layouts/default.vue
 * @Description: 布局 默认
-->
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
