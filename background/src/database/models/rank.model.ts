import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'w_level', timestamps: true, comment: '等级表' })
export class Level extends Model {
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
        allowNull: false,
        comment: '名称',
        field: 'name',
        type: DataType.STRING(32)
    })
    name!: string;

    @Column({
      allowNull: false,
      comment: `排序`,
      defaultValue: 1,
      field: `order`,
      type: DataType.TINYINT.UNSIGNED
    })
    order!: number;
}