import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'w_level', timestamps: true, comment: '等级表' })
export class Level extends Model {
    declare id: string;
    @Column({
        allowNull: false,
        comment: '等级编号',
        field: 'id',
        primaryKey: true,
        type: DataType.TINYINT.UNSIGNED,
        validate: {
            min: 1,
            max: 16
        }
    })
    setId(value: string) {
        this.id = value;
    }

    @Column({
        allowNull: false,
        comment: '职务',
        field: 'position',
        type: DataType.STRING(32)
    })
    position!: string;

    @Column({
        allowNull: false,
        comment: '职级',
        field: 'rank',
        type: DataType.STRING(32)
    })
    rank!: string;

    @Column({
        allowNull: false,
        comment: '部门等级',
        field: 'departmentLevel',
        type: DataType.STRING(32)
    })
    departmentLevel?: string;
}