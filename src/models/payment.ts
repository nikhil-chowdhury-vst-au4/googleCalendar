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
    HasOne
} from 'sequelize-typescript';
import BookingDetails from './bookingDetails';
import Customer from './customer';
import User from './user';
@table({
    tableName: 'payments',
    timestamps: true
})
export default class Payments extends Model<Payments> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    id!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    transactionId: string;

    @AllowNull(false)
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    buyerId: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    sellerId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT
    })
    amount!: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    paymentDetails: string;

    @AllowNull(true)
    @ForeignKey(() => BookingDetails)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    bookingId!: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    orderId!: string;

    // @AllowNull(true)
    // @Column({
    //     type: DataType.STRING(100)
    // })
    // error: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(20)
    })
    paymentId: string;

    @Default('Initiated')
    @AllowNull(false)
    @Column({
        type: DataType.ENUM(
            'Success',
            'Failed',
            'Pending',
            'Initiated',
            'Attempted',
            'Refunded'
        )
    })
    status: string;

    @AllowNull(true)
    @Default(0)
    @Column({
        type: DataType.FLOAT
    })
    commission: number;

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

    @HasOne(() => Customer, {
        foreignKey: 'id',
        sourceKey: 'buyerId'
    })
    customer: Customer;
}
