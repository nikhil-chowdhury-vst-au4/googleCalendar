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
    tableName: 'bankDetails',
    timestamps: true
})
export default class BankDetails extends Model<BankDetails> {
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
    accountNumber!: string;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    userId: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    accountId!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    beneficiaryName!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    IFSC!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    emailId: string;

    @Default(1)
    @AllowNull(true)
    @Column({
        type: DataType.BOOLEAN
    })
    isActive: boolean;

    @UpdatedAt
    @AllowNull(false)
    @Column({
        type: 'TIMESTAMP'
    })
    updatedAt: Date;

    @CreatedAt
    @AllowNull(false)
    @Column({
        type: 'TIMESTAMP'
    })
    createdAt: Date;
}
