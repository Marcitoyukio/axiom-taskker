import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Task from 'App/Models/Task'

export default class TasksController {
    public async store({request, response} : HttpContextContract) {
        const body = request.body()
        const task = await Task.create(body)

        response.status(201)

        return {
            message: 'Task sucessfully created!',
            data: task,
        }
    }

    public async index() {
        const tasks = await Task.query()
        .orderBy('task', 'asc')
        return {
            data: tasks
        }
    }

    public async show({params}: HttpContextContract) {
        const task = await Task.findOrFail(params.id)
        return {
            data: task
        }
    }

    public async destroy({params}: HttpContextContract) {
        const task = await Task.findOrFail(params.id)
        await task.delete()
        return {
            message: 'Task sucessfully deleted!',
            data: task
        }
    }

    public async update({params, request}: HttpContextContract) {

        const body = request.body()
        const task = await Task.findOrFail(params.id)

        task.task = body.task
        task.duedate = body.duedate
        await task.save()

        return {
            message: 'Task sucessfully updated!',
            data: task
        }
    }

    public async getTaskByTeam ({ params }: HttpContextContract) {
        const teamID = params.team_id
        const teamTasks = await Task.query().where('team_id', teamID).orderBy('task', 'asc')
        return teamTasks
    }

    public async getTaskByName ({ params }: HttpContextContract) {
        const teamID = params.team_id
        const taskName = params.task_name
        const cleanedTaskName = taskName.replace(/%20/g, ' ')
        const teamTasks = await Task.query().where('team_id', teamID).where('task', cleanedTaskName).firstOrFail()
        return teamTasks
    }

    public async updateTaskStatus ({ params }: HttpContextContract) {
        const taskID = params.id
        const task = await Task.query().where('id', taskID).firstOrFail()
        if (task.status == 'ACTIVE') {
            task.status = 'FINISHED'
        } else if (task.status == 'FINISHED') {
            task.status = 'ACTIVE'
        }
        await task.save()
    }
}
