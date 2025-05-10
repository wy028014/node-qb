<template>
  <el-select :loading="GonganchuData.loading" placeholder="请选择公安处..." v-model="GonganchuData.value"
    @change="func_change">
    <el-option v-for="item in GonganchuData.options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue"
import GonganchuData from './data"
import { useInfoStore } from '@/store"
const infoStore = useInfoStore()
const props = defineProps({
  gonganjuId: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits([`func_change`])
const func_change: () => void = () => {
  emit(`func_change`, GonganchuData.value)
}
onMounted(() => {
  GonganchuData.func_update(props.gonganjuId).then(() => {
    GonganchuData.value = infoStore.info_gonganchu!.id
  })
})
watch(
  () => props.gonganjuId,
  (gonganjuId) => {
    GonganchuData.func_update(gonganjuId)
  }
)
</script>
<style scoped>
::v-deep(.el-select__wrapper) {
  box-shadow: none;
}
</style>
