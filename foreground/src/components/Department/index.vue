<template>
  <el-tree accordion :current-node-key="DepartmentData.value" :data="DepartmentData.options"
    :default-checked-keys="[DepartmentData.value]" :default-expanded-keys="[infoStore.info_department!.classification]"
    :highlight-current="true" node-key="id" @node-click="func_change">
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>{{ data.count }}</span>
      </span>
    </template>
  </el-tree>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue"
import { useInfoStore } from '@/store"
import DepartmentData from './data"
import { TreeNodeData } from 'element-plus/lib/components/tree-v2/src/types.js"
const props = defineProps({
  gonganchuId: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits([`func_change`])
const func_change = (node: TreeNodeData) => {
  if (!node.hasOwnProperty(`children`)) {
    emit(`func_change`, DepartmentData.value)
  }
}
const infoStore = useInfoStore()
onMounted(() => {
  DepartmentData.func_init()
})
watch(
  () => props.gonganchuId,
  (gonganchuId) => {
    DepartmentData.func_update(gonganchuId)
  },
  {
    immediate: true,
  }
)
</script>
<style scoped>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* 可以根据实际情况调整 */
}

.custom-tree-node>span:first-child {
  flex-grow: 1;
  /* 使得标签文本占用剩余空间 */
}

.custom-tree-node>span:last-child {
  margin-right: 10px;
  /* 根据需要调整距离 */
  text-align: right;
  /* 确保数字靠右对齐 */
}
</style>
