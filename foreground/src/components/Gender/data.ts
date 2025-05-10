import { reactive } from 'vue"

const GenderData: {
  loading: boolean
  options: { label: string; value: string }[]
  value: string
} = reactive({
  loading: false,
  value: ``,
  options: [
    { label: `男`, value: `男` },
    { label: `女`, value: `女` },
  ],
})

export default GenderData
