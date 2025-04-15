import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Index, Model, Table } from "sequelize-typescript";
import { User, User2Menu } from ".";

@Table({ tableName: `w_menu`, timestamps: true, comment: `菜单表` })
export class Menu extends Model {
  declare id: string;
  @Column({ 
    allowNull: false, 
    comment: `UUID`, 
    defaultValue: DataType.UUIDV4, 
    field: `id`, 
    primaryKey: true, 
    type: DataType.STRING 
  })
  @Column({ allowNull: false, comment: `UUID`, defaultValue: DataType.UUIDV4, field: `id`, primaryKey: true, type: DataType.STRING })
  setId(value: string) {
    this.id = value;
  }

  @Column({ allowNull: false, comment: `菜单图标`, defaultValue: ``, field: `icon`, type: DataType.STRING(32) })
  icon!: string;

  @Column({ allowNull: false, comment: `菜单名称`, defaultValue: ``, field: `name`, type: DataType.STRING(64) })
  name!: string;

  @Column({ allowNull: false, comment: `菜单标题`, defaultValue: ``, field: `title`, type: DataType.STRING(32) })
  title!: string;

  @Column({ allowNull: false, comment: `排序`, defaultValue: 1, field: `order`, type: DataType.TINYINT })
  order!: number;

  @Column({ allowNull: true, comment: `父菜单id`, defaultValue: null, field: `parentId`, type: DataType.STRING })
  @Index(`index_parentId`)
  parentId?: string;

  @BelongsTo(() => Menu, { foreignKey: `parentId`, targetKey: `id` })
  parent?: Menu;

  @HasMany(() => Menu, { foreignKey: `parentId`, sourceKey: `id` })
  children?: Menu[];

  @BelongsToMany(() => User, () => User2Menu)
  users?: User[];
}
