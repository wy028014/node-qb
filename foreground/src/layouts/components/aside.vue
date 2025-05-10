<template>
  <el-aside width="18em" class="bg-#c0dcf7 h-full">
    <Logo></Logo>
    <el-scrollbar class="h-full">
      <el-menu :collapse="collapsed" class="el-menu-vertical-demo" :default-active="activeMenuString"
        :hover-background-color=""#dfedfb"" background-color="#c0dcf7" text-color="#303133" active-text-color="#409EFF"
        unique-opened collapse-transition router>
        <template v-for="route in menuStore.menus" :key="route.path">
          <el-menu-item v-if="
            (!route.children || route.children.length === 0) &&
            !route.meta!.hidden
          " :index="route.path">
            <i :class="`ri-${route.meta!.icon}`" /><span>{{
              route.meta!.title
              }}</span>
          </el-menu-item>
          <el-sub-menu v-if="
            route.children && route.children.length > 0 && !route.meta!.hidden
          " :index="route.path" :model-value="openedMenus[route.path]"
            @update:model-value="handleSubMenuChange(route.path)">
            <template #title>
              <i :class="`ri-${route.meta!.icon}`" />
              <span>{{ route.meta!.title }}</span>
            </template>
            <template v-for="childRoute in route.children" :key="childRoute.path">
              <el-menu-item v-if="!childRoute.meta!.hidden" :index="childRoute.path">
                <i :class="`ri-${childRoute.meta!.icon}`" />
                <span>{{ childRoute.meta!.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue"
import { useRoute } from 'vue-router"
import { useMenuStore } from '@/store"
import Logo from './logo.vue"

const collapsed = ref(false)
const menuStore = useMenuStore()
const route = useRoute()

const activeMenu: ComputedRef<string> = computed(() => {
  const { meta, path } = route
  if (meta?.path) {
    return String(meta.path)
  }
  return path
})
const activeMenuString: string = toRef(activeMenu, `value`).value

// 用于存储当前展开的菜单路径
const openedMenus = ref<Record<string, boolean>>({})

// 子菜单展开变化时的处理方法
const handleSubMenuChange = (path: string) => {
  openedMenus.value[path] = !openedMenus.value[path]
}
</script>

<style scoped>
.el-aside {
  height: 100%;
  border-right: 1px solid #e4e4e4;
}

.el-menu {
  margin-left: 1em;
  padding: 1em 0;

  :deep(.el-sub-menu__title) {
    font-size: 1.2em !important;
  }

  :deep(.el-menu-item) {
    font-size: 1.1em !important;
  }
}

i[class^="ri-"] {
  padding-right: 0.8em;
  scale: 1.6;
}
</style>
