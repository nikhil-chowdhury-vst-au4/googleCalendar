import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table as table,
    UpdatedAt
} from 'sequelize-typescript';

@table({
    tableName: 'availabilityModifications',
    timestamps: true
})
export default class AvailabilityModifications extends Model<AvailabilityModifications> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    id!: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    userId: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    rules!: string;

    @AllowNull(false)
    @Column({
        type: 'DATE'
    })
    date: Date;

    @Default(1)
    @AllowNull(true)
    @Column({
        type: DataType.BOOLEAN
    })
    isActive: boolean;

    @CreatedAt
    @Column({
        type: 'TIMESTAMP'
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        type: 'TIMESTAMP'
    })
    updatedAt: Date;
}
