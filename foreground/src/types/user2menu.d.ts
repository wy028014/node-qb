/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 13:41:59
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:41:58
 * @FilePath: /node-qb/foreground/src/types/user2menu.d.ts
 * @Description: 用户2菜单 接口
 */
interface User2menu {
  id: string
  userId: string
  menuId: string
  permission: string
  user?: string
  menu?: string
}

interface ResUser2menu extends User2menu, Timestamps {}

interface User2menuCreateDto {
  userId: string
  menuId: string
  permission: string
}

interface User2menuQueryDto {
  equals?: {
    userId?: string
    menuId?: string
    permission?: string
  }
  like?: {
    userId?: string
    menuId?: string
    permission?: string
  }
  relations?: string[]
  order?: Record<string, `ASC` | `DESC`>
  page?: number
  size?: number
}

interface User2menuUpdateDto {
  userId?: string
  menuId?: string
  permission?: string
}
