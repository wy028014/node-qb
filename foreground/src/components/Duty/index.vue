<template>
  <el-select
    :clearable="true"
    :loading="DutyData.loading"
    placeholder="请选择职务"
    v-model="DutyData.value"
    @change="func_change"
  >
    <el-option
      v-for="item in DutyData.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue"
import DutyData from './data"
const props = defineProps({
  id: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits([`func_change`])
const func_change = () => {
  emit(`func_change`, DutyData.value)
}
onMounted(() => {
  DutyData.func_update()
})
watch(
  () => props.id,
  (id) => {
    DutyData.value = id
  }
)
</script>
<style scoped></style>
