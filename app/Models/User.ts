import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
import Task from './Task'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public tokenCreatedAt: DateTime

  @column()
  public name: String

  @column()
  public photo: String

  @column()
  public email: String

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public token: string

  @column()
  public profile: String

  @manyToMany(() => Team, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'team_id',
    pivotTable: 'user_teams',
    pivotTimestamps: true
  })
  public teams: ManyToMany<typeof Team>

  @manyToMany(() => Task, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'task_id',
    pivotTable: 'task_users',
    pivotTimestamps: true
  })
  public tasks: ManyToMany<typeof Task>

  @beforeSave()
  public static async hashPassowrd(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  static async authenticate(email, password) {
    const user = await User.query().where('email', email).first()
    
    if (!user) {
      return null
    }
    const isPasswordValid = await Hash.verify(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    return user
  }
}
