import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class BaseRelation extends Model<BaseRelation> {
    @Column({
        allowNull: false,
        comment: `生效时间`,
        defaultValue: DataType.NOW,
        field: `effectiveTime`,
        type: DataType.DATE,
    })
    effectiveTime: Date;

    @Column({
        allowNull: true,
        comment: `过期时间`,
        defaultValue: null,
        field: `expirationTime`,
        type: DataType.DATE,
    })
    expirationTime: Date;
}    