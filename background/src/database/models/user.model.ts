import { BelongsTo,  Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript";
import { Department, Person } from ".";

import { encryption } from "@/utils/bcryptjs.utils";

@Table({ tableName: `w_user`, timestamps: true, comment: `用户表` })
export class User extends Model {
  @Column({
    allowNull: false,
    comment: `用户名`,
    field: `username`,
    type: DataType.STRING(64),
    unique: true
  })
  @Index(`index_username`)
  username!: string;

  @Column({
    allowNull: true,
    comment: `登陆密码`,
    defaultValue: encryption(`e10adc3949ba59abbe56e057f20f883e`),
    field: `password`,
    type: DataType.STRING(64)
  })
  password!: string;

  @Column({
    allowNull: false,
    comment: `类型`,
    defaultValue: `person`,
    field: `classification`,
    type: DataType.ENUM(`person`, `department`),
  })
  @Index(`index_classification`)
  classification!: string;

  declare id: string;
  @Column({
    allowNull: true,
    defaultValue: null,
    field: `id`,
    type: DataType.STRING
  })
  @Index(`index_id`)
  setId(value: string) {
    this.id = value;
  }

  // 关联 Person 模型
  @BelongsTo(() => Person, {
    foreignKey: 'id',
    constraints: false,
    scope: {
      classification: 'person'
    }
  })
  person: Person;

  // 关联 Department 模型
  @BelongsTo(() => Department, {
    foreignKey: 'id',
    constraints: false,
    scope: {
      classification: 'department'
    }
  })
  department: Department;
}
