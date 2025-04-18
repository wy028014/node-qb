import { BelongsTo, HasMany, Column, DataType, Index, Model, Table, PrimaryKey, Default } from "sequelize-typescript";
import { Level, Person2Department } from ".";

@Table({ tableName: `w_department`, timestamps: true, comment: `部门信息表` })
export class Department extends Model {
  @Column({
    allowNull: false,
    comment: `UUID`,
    defaultValue: DataType.UUIDV4,
    field: `uid`,
    primaryKey: true,
    type: DataType.STRING
  })
  uid: string;

  @Column({
    allowNull: true,
    comment: `部门名称`,
    defaultValue: null,
    field: `name`,
    type: DataType.STRING(16)
  })
  name!: string;

  @Column({
    allowNull: false,
    comment: `类型`,
    defaultValue: `基层所队`,
    field: `classification`,
    type: DataType.ENUM(`党委`, `综合管理`, `业务指导`, `基层所队`),
  })
  @Index(`index_classification`)
  classification!: string;

  @Column({
    allowNull: false,
    comment: `排序`,
    defaultValue: 1,
    field: `order`,
    type: DataType.TINYINT.UNSIGNED
  })
  order!: number;

  @Column({
    allowNull: false,
    comment: `部门级别`,
    field: `levelId`,
    type: DataType.STRING
  })
  @Index(`index_levelId`)
  levelId: string;

  @BelongsTo(() => Level, { as: `level`, foreignKey: `levelId` })
  level: Level;

  @Column({
    allowNull: true,
    comment: `父部门 ID`,
    field: `parentId`,
    type: DataType.STRING
  })
  @Index(`index_parentId`)
  parentId?: string;

  @BelongsTo(() => Department, { as: `parent`, foreignKey: `parentId` })
  parent?: Department;

  @HasMany(() => Department, { as: `children`, foreignKey: `parentId` })
  children?: Department[];

  @HasMany(() => Person2Department, { foreignKey: 'departmentId' })
  person2Departments: Person2Department[];
}