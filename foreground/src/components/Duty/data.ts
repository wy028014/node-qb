import { reactive } from "vue"
import { DutyApi } from "@/api/modules/"

const DutyData: {
  loading: boolean
  options: { label: string; value: string }[]
  value: string
  func_update: (id?: string) => void
} = reactive({
  loading: false,
  value: ``,
  options: [],
  func_update: (id?: string) => {
    DutyApi.query({ id: id }).then((ResDutyQuery: DutyNamespace.ResDuty[]) => {
      DutyData.options = ResDutyQuery.map((duty: DutyNamespace.ResDuty) => {
        return { label: duty.name, value: duty.id }
      })
    })
  },
})

export default DutyData
