import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'task_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('task_id').unsigned().references('tasks.id').onDelete('CASCADE')
      table.unique(['user_id', 'task_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
