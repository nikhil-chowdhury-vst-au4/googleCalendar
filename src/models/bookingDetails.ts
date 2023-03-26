import {
    Model,
    Column,
    Table as table,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AllowNull,
    Default,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo,
    HasOne
} from 'sequelize-typescript';
import Payments from './payment';
import ServiceDetails from './serviceDetails';
import Testimonials from './testimonials';
@table({
    tableName: 'bookingDetails',
    timestamps: true
})
export default class BookingDetails extends Model<BookingDetails> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    id!: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    eventId: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    iCalUID: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    meetingLink: string;

    // @AllowNull(false)
    // @Column({
    //     type: DataType.INTEGER.UNSIGNED
    // })
    // buyerId: number;
    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    answers: string;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    sellerId!: number;

    @AllowNull(false)
    @Column({
        type: 'DATE'
    })
    bookingDate: Date;

    @AllowNull(true)
    @Column({
        type: DataType.DATE
    })
    from!: Date;

    @AllowNull(true)
    @Column({
        type: DataType.DATE
    })
    to!: Date;

    @AllowNull(false)
    @ForeignKey(() => ServiceDetails)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    serviceId!: number;

    @Default('Initiated')
    @AllowNull(false)
    @Column({
        type: DataType.ENUM('booked', 'failed', 'pending', 'cancelled')
    })
    status: string;

    @Default('pending')
    @AllowNull(false)
    @Column({
        type: DataType.ENUM('pending', 'sent')
    })
    testimonialTrigger: string;

    @CreatedAt
    @AllowNull(false)
    @Column({
        type: 'TIMESTAMP'
    })
    createdAt: Date;

    @UpdatedAt
    @AllowNull(false)
    @Column({
        type: 'TIMESTAMP'
    })
    updatedAt: Date;

    @BelongsTo(() => ServiceDetails)
    service: ServiceDetails;

    @HasOne(() => Payments)
    payment: Payments;

    @HasOne(() => Testimonials)
    testimonial: Testimonials;
}
