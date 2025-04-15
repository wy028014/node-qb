<template>
    <el-button-group>
        <el-button v-if="permission!.add" color="#2177B8" round plain @click="handleClick(`add`)">新增<i
                :class="`ri-add-line`" /></el-button>
        <el-button v-if="permission!.edit" color="#909399" round plain @click="handleClick(`edit`)">修改<i :class="`ri-edit-line`" /></el-button>
        <el-button v-if="permission!.delete" color="#f07c82" round plain @click="handleClick(`delete`)">删除<i
                :class="`ri-delete-bin-line`" /></el-button>
        <el-button v-if="permission!.import" color="#61649f" round plain @click="handleClick(`import`)"> 导入 <i :class="`ri-upload-line`" /></el-button>
        <el-button v-if="permission!.export" color="#1ba784" round plain @click="handleClick(`export`)">导出<i :class="`ri-download-line`" /></el-button>
        <el-dropdown placement="bottom-start" trigger="click" :show-timeout="0" :hide-timeout="0">
            <el-button color="#5c2223" round plain split-button>筛选<i :class="`ri-filter-line`" /></el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="col in columns" :key="col.prop">
                        <el-checkbox v-model="col.isShow"
                            @change="(value: boolean) => handleColumnVisibilityChange(col.prop || ``, value)">
                            {{ col.label || `选择` }}
                        </el-checkbox>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-button-group>
</template>
<script setup lang="ts">
const props = defineProps({
    permission: {
        type: Object,
        default: {
            add: false,
            edit: false,
            delete: false,
            import: false,
            export: false,
        },
    },
    columns: {
        type: Array<ElementPlusNamespace.TableNamespace[`Column`]>,
        default: []
    }
})
const emit = defineEmits<{
    (e: `click`, type: string): void;
    (e: `column-visibility-change`, prop: string, visible: boolean): void
}>();
const handleClick = (type: string) => {
    emit(`click`, type);
};
const handleColumnVisibilityChange = (prop: string, visible: boolean) => {
    emit(`column-visibility-change`, prop, visible)
}
</script>
<style scoped>
i[class^='ri-'] {
    padding-left: 0.8em;
    scale: 1.2;
}
</style>