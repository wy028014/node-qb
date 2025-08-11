/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 11:46:46
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-08 14:23:20
 * @FilePath: /node-qb/foreground/src/types/user.d.ts
 * @Description: 用户 接口
 */
interface ViewUser {
  id: string
  username: string
  password?: string
  user2menus?: User2menu[]
}

interface ResUser extends ViewUser, Timestamps {}

interface UserCreateDto {
  username: string
  password: string
}

interface UserQueryDto {
  equals?: {
    username?: string
  }
  like?: {
    username?: string
  }
  relations?: string[]
  order?: Record<string, `ASC` | `DESC`>
  page?: number
  size?: number
}

interface UserUpdateDto {
  username?: string
  password?: string
}
