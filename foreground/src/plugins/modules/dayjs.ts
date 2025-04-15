import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

dayjs.extend(isLeapYear)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale(`zh-cn`)

export const Dayjs = dayjs

export function func_getAgeFromIdCard(idCardNumber: string): number {
  if (idCardNumber.length !== 18) {
    throw new Error(`身份证号码必须是18位`)
  }
  const birthDateStr = idCardNumber.substr(6, 14)
  const birthDate = dayjs(birthDateStr, `YYYYMMDD`)
  const today: dayjs.Dayjs = dayjs.utc().local()
  const age = today.diff(birthDate, `years`)

  return parseInt(age.toString())
}
