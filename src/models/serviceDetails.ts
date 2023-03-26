import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table as table,
    UpdatedAt
} from 'sequelize-typescript';
import BookingDetails from './bookingDetails';
import BookingQuestions from './bookingQuestions';
import Testimonials from './testimonials';
import User from './user';

@table({
    tableName: 'serviceDetails',
    timestamps: true
})
export default class ServiceDetails extends Model<ServiceDetails> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    userId!: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    description?: string;

    @AllowNull(true)
    @Column({
        type: DataType.INTEGER
    })
    duration: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    title: string;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.INTEGER
    })
    price: number;

    @AllowNull(false)
    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isFree: boolean;

    @AllowNull(true)
    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    isActive: boolean;

    @AllowNull(false)
    @Default('default')
    @Column({
        type: DataType.ENUM('default', 'usergenerated')
    })
    serviceType: string;

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

    @BelongsTo(() => User)
    creator: User;

    @HasMany(() => BookingDetails)
    bookings: BookingDetails[];

    @HasMany(() => Testimonials)
    testimonials: Testimonials[];

    @HasMany(() => BookingQuestions)
    questions: BookingQuestions[];
}
