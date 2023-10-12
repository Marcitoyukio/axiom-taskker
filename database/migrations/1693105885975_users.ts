import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('token_created_at', { useTz: true })
      table.string('name', 120).notNullable()
      table.string('photo')
      table.string('email', 90).notNullable().unique()
      table.string('password')
      table.string('token')
      table.string('profile', 4).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
