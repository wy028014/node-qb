import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Person } from "./person.model";
import { Department } from ".";

@Table({ tableName: `w_person2department`, timestamps: false, comment: `人员与部门关联表` })
export class Person2Department extends Model {
    @ForeignKey(() => Person)
    @Column({
        field: `personId`,
        type: DataType.STRING
    })
    personId: string;

    @ForeignKey(() => Department)
    @Column({
        field: `departmentId`,
        type: DataType.STRING
    })
    departmentId: string;

    @Column({
        allowNull: false,
        comment: `关联时间`,
        field: `associatedTime`,
        type: DataType.DATE
    })
    associatedTime: Date;

    @Column({
        allowNull: false,
        comment: `生效时间`,
        field: `effectiveTime`,
        type: DataType.DATE
    })
    effectiveTime: Date;

    @Column({
        allowNull: true,
        comment: `过期时间`,
        field: `expirationTime`,
        type: DataType.DATE
    })
    expirationTime: Date | null;

    @BelongsTo(() => Person, { foreignKey: 'personId' })
    person: Person;

    @BelongsTo(() => Department, { foreignKey: 'departmentId' })
    department: Department;
}