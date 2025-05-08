import { reactive } from "vue"
import { GonganchuApi } from "@/api/modules"

const GonganchuData: {
  loading: boolean
  options: {
    label: string
    value: string
  }[]
  value: string
  func_update: (id: string) => Promise<void>
} = reactive({
  loading: false,
  value: ``,
  options: [],
  func_update: async (id: string) => {
    if (id === ``) return
    const ResGonganchuQuery: GonganchuNamespace.ResGonganchu[] =
      await GonganchuApi.query({
        gonganjuId: id,
      })
    GonganchuData.options = ResGonganchuQuery.map(
      (gonganchu: GonganchuNamespace.ResGonganchu) => {
        return {
          label: gonganchu.name,
          value: gonganchu.id,
        }
      }
    )
    GonganchuData.loading = GonganchuData.options!.length === 0
  },
})
export default GonganchuData
