/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-08 14:42:41
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:42:13
 * @FilePath: /node-qb/foreground/src/api/modules/menu.api.ts
 * @Description: 菜单 api
 */
import api from "@/api";

export const MenuApi = {
  async create(
    payload: MenuCreateDto[]
  ): Promise<ApiResponse<{ success: ResMenu[]; fail: MenuCreateDto[] }>> {
    return api.post(`/menu`, payload);
  },

  async query(
    params: MenuQueryDto
  ): Promise<ApiResponse<{ list: ResMenu[]; total: number }>> {
    return api.get(`/menu?${params}`);
  },

  async update(
    id: string,
    payload: MenuUpdateDto
  ): Promise<ApiResponse<ResMenu>> {
    return api.patch(`/menu/${id}`, payload);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/menu/${id}`);
  },
};
