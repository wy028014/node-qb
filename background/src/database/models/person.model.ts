import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import {
  Department,
  Person2Department,
} from ".";

@Table({ tableName: `w_person`, timestamps: true, comment: `个人信息表` })
export class Person extends Model {
  declare id: string;
  @Column({
    allowNull: false,
    comment: `UUID`,
    defaultValue: DataType.UUIDV4,
    field: `id`,
    primaryKey: true,
    type: DataType.STRING
  })
  setId(value: string) {
    this.id = value;
  }

  @Column({
    allowNull: true,
    comment: `姓名`,
    defaultValue: null,
    field: `name`,
    type: DataType.STRING(16),
    validate: {
      len: [1, 16], // 姓名长度限制在 1 到 16 个字符之间
    }
  })
  name!: string;

  @Column({
    allowNull: false,
    comment: `性别`,
    defaultValue: `男`,
    field: `gender`,
    type: DataType.ENUM(`男`, `女`)
  })
  gender!: string;

  @Column({
    allowNull: true,
    comment: `警号`,
    defaultValue: null,
    field: `police_number`,
    type: DataType.STRING(6),
    validate: {
      len: [1, 6], // 警号长度限制在 1 到 6 个字符之间
      isNumeric: true
    }
  })
  police_number!: string;

  @Column({
    allowNull: true,
    comment: `身份证号码`,
    defaultValue: null,
    field: `identification_number`,
    type: DataType.STRING(18),
    validate: {
      len: [18, 18], // 身份证号码长度必须为 18 个字符
      is: /^[0-9]{17}[0-9Xx]$/ // 简单的身份证号码格式验证
    }
  })
  identification_number!: string;

  @Column({
    allowNull: true,
    comment: `手机号码`,
    defaultValue: null,
    field: `phone_number`,
    type: DataType.STRING(11),
    validate: {
      len: [11, 11], // 手机号码长度必须为 11 个字符
      isNumeric: true // 手机号码必须为数字
    }
  })
  phone_number!: string;

  @BelongsToMany(() => Department, () => Person2Department)
  departments: Department[];
}
