import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript";
import { Menu, User } from ".";

@Table({ tableName: `w_user2menu`, timestamps: true, comment: `用户对应菜单表` })
export class User2Menu extends Model {
  @ForeignKey(() => User)
  @Column({ field: `userId`, type: DataType.STRING })
  @Index(`index_userId`)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Menu)
  @Column({ field: `menuId`, type: DataType.STRING })
  @Index(`index_menuId`)
  menuId!: string;

  @BelongsTo(() => Menu)
  menu!: Menu;

  @Column({
    allowNull: false,
    comment: `权限`,
    defaultValue: `00000000`,
    field: `permission`,
    validate: { len: [8, 8], is: /^[01]+$/ },
    type: DataType.STRING(8),
  })
  permission!: string;
}
