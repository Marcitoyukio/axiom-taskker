import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Activity from 'App/Models/Activity'
import ActivityUser from 'App/Models/ActivityUser'

export default class TaskUsersController {
    public async store({ request, response }: HttpContextContract) {
        const data = request.only(['user_id', 'activity_id'])
        const activityUser = await ActivityUser.create(data)

        response.status(201)

        return {
            message: 'User sucessfully linked with an activity!',
            data: activityUser,
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        const activityUser = await ActivityUser.query().where('activity_id', params.activity_id).where('user_id', params.user_id).firstOrFail()
        await activityUser.delete()

        response.status(201)

        return {
            message: 'User link with activity sucessfully deleted!',
            data: activityUser
        }
    }

    public async getUsersByActivities({ params }: HttpContextContract) {
        const activityID = params.activity_id
        const activity = await Activity.findOrFail(activityID)
        const activityUser = await activity.related('users').query().orderBy('name', 'asc')
        return activityUser
    }

    public async removeActivityUsers({ params }: HttpContextContract) {
        const activityID = params.activity_id
        const activity = await Activity.findOrFail(activityID)
        const activityUser = await activity.related('users').query()
        if (activityUser) {
            activityUser.forEach(async (user) => {
                const userActivity = await ActivityUser.query().where('user_id', user.id).where('activity_id', activityID).firstOrFail()
                await userActivity.delete()
            })
        }
    }
}
