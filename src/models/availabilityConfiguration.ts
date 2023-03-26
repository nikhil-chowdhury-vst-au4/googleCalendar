import {
    AllowNull,
    Column,
    CreatedAt,
    DataType,
    Model,
    PrimaryKey,
    Table as table,
    UpdatedAt
} from 'sequelize-typescript';

@table({
    tableName: 'availabilityConfiguration',
    timestamps: true
})
export default class AvailabilityConfiguration extends Model<AvailabilityConfiguration> {
    @PrimaryKey
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    userId: number;

    @AllowNull(true)
    @Column({
        type: DataType.ENUM('minutes', 'hours', 'days', 'weeks')
    })
    periodType: string;

    @AllowNull(true)
    @Column({
        type: DataType.INTEGER
    })
    periodValue: number;

    @AllowNull(true)
    @Column({
        type: DataType.INTEGER
    })
    maxWindow: number;

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
