import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Task from './Task'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public team: String

  @column()
  public logo: String

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'team_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_teams',
    pivotTimestamps: true
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Task)
  public posts: HasMany<typeof Task>
}
