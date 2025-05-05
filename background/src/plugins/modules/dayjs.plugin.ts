/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 13:42:48
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 08:56:09
 * @FilePath: /nodejs-qb/background/src/plugins/modules/dayjs.plugin.ts
 * @Description: 插件 日期时间
 */
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-cn";

// 扩展 dayjs 功能
dayjs.extend(isLeapYear);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale(`zh-cn`);

// 导出格式化后的 dayjs 实例
export const Dayjs = dayjs;

/**
 * 格式化日期为 `YYYY-MM-DD HH:mm:ss.SSSS` 格式
 * @param date - 待格式化的 Date 或 dayjs 可解析值
 * @returns 格式化字符串
 */
export function formatDate(date: Date | string | number): string {
    return dayjs(date).format(`YYYY-MM-DD HH:mm:ss.SSSS`);
}

/**
 * 根据身份证号码计算年龄
 * @param idCardNumber - 18位身份证号码
 * @returns 年龄
 * @throws {Error} 如果身份证号码不是18位
 */
export function func_getAgeFromIdCard(idCardNumber: string): number {
    if (idCardNumber.length !== 18) {
        throw new Error(`输入的身份证号码 ${idCardNumber} 长度不为18位, 必须是18位身份证号码`);
    }
    const birthDateStr = idCardNumber.substring(6, 14);
    const birthDate = dayjs(birthDateStr, `YYYYMMDD`);
    const today = dayjs.utc().local();
    const age = today.diff(birthDate, `years`);

    return parseInt(age.toString(), 10);
}
