<template>
  <el-footer class="bg-#a6c9ed h-3 lh-2 text-center fs-1.2 p-0.5">版权所有 © {{ $dayjs().format(`YYYY`) }} 王野</el-footer>
</template>
<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
const instance: ComponentInternalInstance | null = getCurrentInstance()
const $dayjs = instance!.appContext.config.globalProperties.$dayjs
</script>
<style scoped></style>
