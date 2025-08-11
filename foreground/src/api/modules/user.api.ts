/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 11:21:09
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:42:24
 * @FilePath: /node-qb/foreground/src/api/modules/user.api.ts
 * @Description: 用户 api
 */
import api from "@/api";

export const UserApi = {
  async create(
    payload: UserCreateDto[]
  ): Promise<ApiResponse<{ success: ResUser[]; fail: UserCreateDto[] }>> {
    return api.post(`/user`, payload);
  },

  async query(
    params: UserQueryDto
  ): Promise<ApiResponse<{ list: ResUser[]; total: number }>> {
    return api.get(`/user?${params}`);
  },

  async update(
    id: string,
    payload: UserUpdateDto
  ): Promise<ApiResponse<ResUser>> {
    return api.patch(`/user/${id}`, payload);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/user/${id}`);
  },
};
