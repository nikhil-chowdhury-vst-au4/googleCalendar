import {
    Model,
    Column,
    Table as table,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AllowNull,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';
import User from './user';
@table({
    tableName: 'creatorMarketing',
    timestamps: true
})
export default class CreatorMarketing extends Model<CreatorMarketing> {
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
        type: DataType.INTEGER.UNSIGNED
    })
    userId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    segment: number;

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

    @BelongsTo(() => User)
    creator: User;
}
