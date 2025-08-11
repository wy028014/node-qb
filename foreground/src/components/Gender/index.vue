<template>
  <el-select
    :clearable="true"
    :loading="GenderData.loading"
    placeholder="请选择性别"
    v-model="GenderData.value"
    @change="func_change"
  >
    <el-option
      v-for="item in GenderData.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue"
import GenderData from './data"
const props = defineProps({
  id: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits([`func_change`])
const func_change = () => {
  emit(`func_change`, GenderData.value)
}
onMounted(() => {})
watch(
  () => props.id,
  (id) => {
    GenderData.value = id
  }
)
</script>
<style scoped></style>
