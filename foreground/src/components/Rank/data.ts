import { reactive } from "vue"
import { RankApi } from "@/api/modules"
import { Option } from "element-plus/es/components/select-v2/src/select.types.mjs"

const RankData: {
  loading: boolean
  options: Option[]
  value: string
  func_update: (id?: string) => void
} = reactive({
  loading: false,
  value: ``,
  options: [
    {
      label: `执法勤务`,
      options: [],
    },
    {
      label: `警务技术`,
      options: [],
    },
    {
      label: `综合管理`,
      options: [],
    },
  ],
  func_update: (id?: string) => {
    RankApi.query({
      id: id,
      exclude: [`createdAt`, `updatedAt`, `deletedAt`],
    }).then((ResRankQuery: RankNamespace.ResRank[]) => {
      ResRankQuery.map((rank: RankNamespace.ResRank) => {
        RankData.options.map((optionsGroup: Option) => {
          if (optionsGroup.label === rank.classification) {
            optionsGroup.options.push({
              label: rank.name,
              value: rank.id,
            })
          }
        })
      })
    })
  },
})

export default RankData
