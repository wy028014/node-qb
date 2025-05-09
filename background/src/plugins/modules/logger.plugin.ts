/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 13:35:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-09 08:03:08
 * @FilePath: /nodejs-qb/background/src/plugins/modules/logger.plugin.ts
 * @Description: 插件 日志
 */
import { Logger, LogLevel } from "@nestjs/common";
import { Dayjs } from "../";

// 定义日志级别
type LogLevelType = LogLevel | `all`;

export class CustomLogger {
    private readonly logger: Logger = new Logger();
    private logLevels: LogLevelType[] = [`log`, `error`, `warn`, `debug`, `verbose`];

    constructor(logLevels?: LogLevelType[]) {
        if (logLevels) {
            this.logLevels = logLevels.includes(`all`) ? [`log`, `error`, `warn`, `debug`, `verbose`] : logLevels;
        }
    }

    private shouldLog(level: LogLevelType): boolean {
        return this.logLevels.includes(level);
    }

    /**
     * 记录普通日志
     * @param message - 日志信息
     */
    log(message: string) {
        if (this.shouldLog(`log`)) {
            const timestamp: string = Dayjs().format(`YYYY-MM-DD HH:mm:ss`);
            this.logger.log(`${timestamp} | ${message}`);
        }
    }

    /**
     * 记录错误日志
     * @param message - 错误信息
     * @param trace - 错误堆栈信息
     */
    error(message: string, trace?: string) {
        if (this.shouldLog(`error`)) {
            const timestamp: string = Dayjs().format(`YYYY-MM-DD HH:mm:ss`);
            this.logger.error(`${timestamp} | ${message}`, trace);
        }
    }

    /**
     * 记录警告日志
     * @param message - 警告信息
     */
    warn(message: string) {
        if (this.shouldLog(`warn`)) {
            const timestamp: string = Dayjs().format(`YYYY-MM-DD HH:mm:ss`);
            this.logger.warn(`${timestamp} | ${message}`);
        }
    }

    /**
     * 记录调试日志
     * @param message - 调试信息
     */
    debug(message: string) {
        if (this.shouldLog(`debug`)) {
            const timestamp: string = Dayjs().format(`YYYY-MM-DD HH:mm:ss`);
            this.logger.debug(`${timestamp} | ${message}`);
        }
    }

    /**
     * 记录详细日志
     * @param message - 详细信息
     */
    verbose(message: string) {
        if (this.shouldLog(`verbose`)) {
            const timestamp: string = Dayjs().format(`YYYY-MM-DD HH:mm:ss`);
            this.logger.verbose(`${timestamp} | ${message}`);
        }
    }
}