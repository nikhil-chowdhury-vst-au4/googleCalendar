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
import Payments from './payment';

@table({
    tableName: 'transferDetails',
    timestamps: true
})
export default class TransferDetails extends Model<TransferDetails> {
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
    orderId!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    transferId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    accountId: string;

    @AllowNull(true)
    @ForeignKey(() => Payments)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    paymentId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT
    })
    amount!: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    transferDetails: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    error: string;

    @Default('Initiated')
    @AllowNull(false)
    @Column({
        type: DataType.ENUM('Initiated', 'Processed', 'Failed')
    })
    status: string;

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

    @HasOne(() => Payments, {
        foreignKey: 'id',
        sourceKey: 'paymentId'
    })
    payment: Payments;
}
