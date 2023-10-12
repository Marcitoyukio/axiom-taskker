import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskUser from 'App/Models/TaskUser'
import Redis from 'Config/redis'

export default class TaskUsersController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['user_id', 'task_id'])
    const taskUser = await TaskUser.create(data)

    const taskID = data.task_id
    await Redis.del(`taskUsers:${taskID}`)

    response.status(201)

    return {
      message: 'User successfully linked with a task!',
      data: taskUser,
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const taskUser = await TaskUser.query()
      .where('task_id', params.task_id)
      .where('user_id', params.user_id)
      .firstOrFail()

    const taskID = params.task_id
    await Redis.del(`taskUsers:${taskID}`)

    await taskUser.delete()

    response.status(201)

    return {
      message: 'User link with task successfully deleted!',
      data: taskUser,
    }
  }

  public async getUsersByTasks({ params }: HttpContextContract) {
    const taskID = params.task_id
    const task = await Task.findOrFail(taskID)

    const cachedResult = await Redis.get(`taskUsers:${taskID}`)
    if (cachedResult) {
      return cachedResult
    }

    const taskUsers = await task.related('users').query().orderBy('name', 'asc')

    await Redis.setex(`taskUsers:${taskID}`, 3600, JSON.stringify(taskUsers))

    return taskUsers
  }

  public async getUserMostRecentTask({ params, response }: HttpContextContract) {
    try {
      const recentTask = await TaskUser.query()
        .where('user_id', params.user_id)
        .orderBy('created_at', 'desc')
        .firstOrFail()

      const userRecentTask = await Task.query()
        .where('id', recentTask.task_id)
        .orderBy('created_at', 'desc')
        .firstOrFail()

      return userRecentTask
    } catch (e) {
      response.status(404).send('Recurso não encontrado')
    }
  }

  public async removeTaskUsers({ params }: HttpContextContract) {
    const taskId = params.task_id
    const task = await Task.findOrFail(taskId)
    const userTasks = await task.related('users').query()

    if (userTasks) {
      userTasks.forEach(async (user) => {
        const userTask = await TaskUser.query()
          .where('user_id', user.id)
          .where('task_id', taskId)
          .firstOrFail()

        await userTask.delete()
      })
      await Redis.del(`taskUsers:${taskId}`)
    }
  }
}
