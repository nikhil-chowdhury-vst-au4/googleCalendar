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
import BookingDetails from './bookingDetails';
import Customer from './customer';
import ServiceDetails from './serviceDetails';

@table({
    tableName: 'testimonials',
    timestamps: true
})
export default class Testimonials extends Model<Testimonials> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => BookingDetails)
    @Column({
        type: DataType.INTEGER
    })
    bookingId!: number;

    @AllowNull(false)
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER
    })
    customerId: number;

    @AllowNull(false)
    @ForeignKey(() => ServiceDetails)
    @Column({
        type: DataType.INTEGER
    })
    serviceId: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    sellerId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    rating!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    testimonial!: string;

    @AllowNull(true)
    @Column({
        type: DataType.BOOLEAN
    })
    isPublished!: boolean;

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

    @BelongsTo(() => Customer)
    customer: Customer;

    @BelongsTo(() => ServiceDetails)
    service: ServiceDetails;
}
