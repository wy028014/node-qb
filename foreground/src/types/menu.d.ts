/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 14:36:19
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-08 14:40:10
 * @FilePath: /node-qb/foreground/src/types/menu.d.ts
 * @Description: 菜单 接口
 */

interface ViewMenu {
  id: string
  icon: string
  name: string
  order: number
  path: string
  title: string
  isEnabled: boolean
  level: number
}

interface ResMenu extends ViewMenu, Timestamps {
  parentId?: string
  children?: ResMenu[]
  parent?: ResMenu
  user2menus?: User2menu[]
}

interface MenuCreateDto {
  name: string
  order: number
  path: string
  title: string
  isEnabled: boolean
  level: number
}

interface MenuQueryDto {
  equals?: {
    name?: string
    order?: number
    path?: string
    title?: string
    isEnabled?: boolean
    level?: number
  }
  like?: {
    name?: string
    order?: number
    path?: string
    title?: string
    isEnabled?: boolean
    level?: number
  }
  relations?: string[]
  order?: Record<string, `ASC` | `DESC`>
  page?: number
  size?: number
}

interface MenuUpdateDto {
  name?: string
  order?: number
  path?: string
  title?: string
  isEnabled?: boolean
  level?: number
  parentId?: string
}
