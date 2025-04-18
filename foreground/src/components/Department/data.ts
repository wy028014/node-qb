import { reactive } from 'vue';
import { DepartmentApi } from '@/api/modules/';
import { useInfoStore } from '@/store';

const DepartmentData: {
  value: string;
  options: {
    label: string;
    id: string;
    count: number;
    children?: any;
  }[];
  func_init: () => void;
  func_update: (id: string) => void;
} = reactive({
  value: ``,
  options: [
    { id: `全处`, count: 0, label: `全处` },
    { id: `处党委`, children: [], count: 0, label: `处党委` },
    { id: `综合管理科室`, children: [], count: 0, label: `综合管理科室` },
    { id: `业务指导支队`, children: [], count: 0, label: `业务指导支队` },
    { id: `基层所队`, children: [], count: 0, label: `基层所队` },
  ],
  func_init: () => {
    const infoStore = useInfoStore();
    DepartmentData.options = [
      { label: `全处`, count: 0, id: `全处` },
      { label: `处党委`, children: [], count: 0, id: `处党委` },
      { label: `综合管理科室`, children: [], count: 0, id: `综合管理科室` },
      { label: `业务指导支队`, children: [], count: 0, id: `业务指导支队` },
      { label: `基层所队`, children: [], count: 0, id: `基层所队` },
    ];
    DepartmentData.func_update(infoStore.info_gonganchu!.id);
    DepartmentData.value = infoStore.info_department!.id;
  },
  func_update: (id: string) => {
    if (id === ``) return;
    DepartmentData.options.map((options) => {
      if (options.id !== `全处`) {
        DepartmentApi.query({
          gonganchuId: id,
          classification: options.label,
          exclude: [`password`, `createdAt`, `updatedAt`, `deletedAt`],
          include: [`user`],
        }).then((ResClassificationQuery: DepartmentNamespace.Res[]) => {
          ResClassificationQuery.map((department: DepartmentNamespace.Res) => {
            options.children.push({
              id: department.id,
              label: department.name,
              count: department.users?.length,
            });
            options.count += department.users?.length || 0;
          });
          DepartmentData.options[0].count += options.count;
        });
      }
    });
  },
});
export default DepartmentData;
