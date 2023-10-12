import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Activity from 'App/Models/Activity'

export default class ActivitiesController {
    public async store({request, response} : HttpContextContract) {
        const body = request.body()
        const activity = await Activity.create(body)

        response.status(201)

        return {
            message: 'Activity sucessfully created!',
            data: activity,
        }
    }

    public async index() {
        const activities = await Activity.query()
        .orderBy('activity', 'asc')
        return {
            data: activities
        }
    }

    public async show({params}: HttpContextContract) {
        const activity = await Activity.findOrFail(params.id)
        return {
            data: activity
        }
    }

    public async destroy({params}: HttpContextContract) {
        const activity = await Activity.findOrFail(params.id)
        await activity.delete()
        return {
            message: 'Activity sucessfully deleted!',
            data: activity
        }
    }

    public async update({params, request}: HttpContextContract) {

        const body = request.body()
        const activity = await Activity.findOrFail(params.id)

        activity.activity = body.activity
        activity.status = body.status
        await activity.save()

        return {
            message: 'Activity sucessfully updated!',
            data: activity
        }
    }

    public async getActivityByTask ({ params }: HttpContextContract) {
        const taskID = params.task_id
        const activitiesTask = await Activity.query().where('task_id', taskID).orderBy('activity', 'asc')
        return activitiesTask
    }

    public async updateActivityStatus ({ params }: HttpContextContract) {
        const activityID = params.id
        const activity = await Activity.query().where('id', activityID).firstOrFail()
        if (activity.status == 'ACTIVE') {
            activity.status = 'FINISHED'
        } else if (activity.status == 'FINISHED') {
            activity.status = 'ACTIVE'
        }
        await activity.save()
    }
}
