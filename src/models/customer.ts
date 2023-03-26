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
import Testimonials from './testimonials';

@table({
    tableName: 'customer',
    timestamps: true
})
export default class Customer extends Model<Customer> {
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

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    name!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    mobile!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    query: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    linkedinUrl: string;

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

    @HasMany(() => Testimonials)
    testimonials: Testimonials[];
}
