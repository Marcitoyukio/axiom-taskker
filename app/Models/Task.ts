import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public task: String

  @column()
  public duedate: String

  @column()
  public status: String

  @column()
  public team_id: number

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'task_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'task_users',
    pivotTimestamps: true
  })
  public users: ManyToMany<typeof User>
}
