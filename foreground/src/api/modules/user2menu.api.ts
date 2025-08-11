/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 14:43:17
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:42:29
 * @FilePath: /node-qb/foreground/src/api/modules/user2menu.api.ts
 * @Description: 用户2菜单 api
 */
import api from "@/api";

export const User2menuApi = {
  async create(
    payload: User2menuCreateDto[]
  ): Promise<
    ApiResponse<{ success: ResUser2menu[]; fail: User2menuCreateDto[] }>
  > {
    return api.post(`/user2menu`, payload);
  },

  async query(
    params: User2menuQueryDto
  ): Promise<ApiResponse<{ list: ResUser2menu[]; total: number }>> {
    return api.get(`/user2menu?${params}`);
  },

  async update(
    id: string,
    payload: User2menuUpdateDto
  ): Promise<ApiResponse<ResUser2menu>> {
    return api.patch(`/user2menu/${id}`, payload);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/user2menu/${id}`);
  },
};
