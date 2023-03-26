import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table as table,
    UpdatedAt
} from 'sequelize-typescript';
import ServiceDetails from './serviceDetails';

@table({
    tableName: 'bookingQuestions',
    timestamps: true
})
export default class BookingQuestions extends Model<BookingQuestions> {
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
    sellerId!: number;

    @AllowNull(false)
    @ForeignKey(() => ServiceDetails)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    serviceId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    question!: string;

    @AllowNull(true)
    @Column({
        type: DataType.BOOLEAN
    })
    isDeleted?: boolean;

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

    @BelongsTo(() => ServiceDetails)
    service: ServiceDetails;
}
