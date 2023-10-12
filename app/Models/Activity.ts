import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public activity: String

  @column()
  public status: String

  @column()
  public task_id: number

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'activity_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'activity_users',
    pivotTimestamps: true
  })
  public users: ManyToMany<typeof User>
}
