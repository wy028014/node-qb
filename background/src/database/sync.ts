import * as models from "@/database/models";
import { Logger } from "@nestjs/common";

const syncOrder: string[] = [
    `User`,
];
export const sync: () => Promise<void> = async () => {
    try {
        // 遍历定义的顺序数组
        for (const modelName of syncOrder) {
            const model = models[modelName];
            if (model) {
                // 同步模型
                await model
                    .sync({ alter: true })
                    .then(() => {
                        Logger.log(`${modelName} 同步成功`);
                    })
                    .catch((error) => {
                        Logger.error(`${modelName} 同步失败`, error);
                    });
            } else {
                Logger.warn(`未找到名为 ${modelName} 的模型`);
            }
        }
        Logger.debug(`所有模型同步完成`);
    } catch (error) {
        Logger.error(`模型同步过程中出现异常`, error);
        throw error;
    }
};
