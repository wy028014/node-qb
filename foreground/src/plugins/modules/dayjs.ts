/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-15 06:08:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 14:58:37
 * @FilePath: /nodejs-qb/foreground/src/plugins/modules/dayjs.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
