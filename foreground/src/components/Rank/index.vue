<template>
  <el-select
    :clearable="true"
    :loading="RankData.loading"
    placeholder="请选择职级"
    v-model="RankData.value"
    @change="func_change"
  >
    <el-option-group v-for="group in RankData.options" :key="group.label" :label="group.label">
      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
    </el-option-group>
  </el-select>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue"
import RankData from "./data"
const props = defineProps({
  id: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits([`func_change`])
const func_change = () => {
  emit(`func_change`, RankData.value)
}
onMounted(() => {
  RankData.func_update()
})
watch(
  () => props.id,
  (id) => {
    RankData.value = id
  }
)
</script>
<style scoped></style>
