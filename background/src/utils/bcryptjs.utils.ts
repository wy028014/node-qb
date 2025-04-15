import bcryptjs from "bcryptjs";
/**
 * @description: 给传递的string类型参数加密, 迭代10次的salt
 * @param {string} userPassword
 * @return {string} 加密后的密码
 */
export function encryption(userPassword: string): string {
  return bcryptjs.hashSync(userPassword, 10);
}
/**
 * @description: 对比传递的用户输入密码和数据库存储密码
 * @param {string} userPassword
 * @param {string} databasePassword
 * @return {boolean} 对比结果
 */
export function compare(userPassword: string, databasePassword: string): boolean {
  return bcryptjs.compareSync(userPassword, databasePassword);
}
