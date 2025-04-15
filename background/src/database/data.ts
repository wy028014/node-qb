import {
  User
} from "./models";
import {
  UserData,
} from "./datas";

export const data: () => Promise<void> = async () => {
  (await User.findAll()).length === 0 ? await User.bulkCreate(UserData) : null;
};
