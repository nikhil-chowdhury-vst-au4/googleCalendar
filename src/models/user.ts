import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table as table,
    UpdatedAt
} from 'sequelize-typescript';
import ServiceDetails from './serviceDetails';

@table({
    tableName: 'user',
    timestamps: true
})
export default class User extends Model<User> {
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
    email!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    mobile: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    name: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    googleUrl: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    refreshToken: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    imageUrl: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    expertise!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    username!: string;

    @AllowNull(true)
    @Column({
        type: DataType.FLOAT
    })
    commissionPercentage: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    source: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    campaign: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    medium: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    signupPoint: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    about!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    socialLinks!: string;

    @AllowNull(true)
    @Column({
        type: DataType.FLOAT
    })
    rating: number;

    @AllowNull(true)
    @Column({
        type: DataType.NUMBER
    })
    numRatings: number;

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

    @HasMany(() => ServiceDetails)
    serviceDetails: ServiceDetails;
}
