import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Message from 'App/Models/Message'

export default class MessagesController {
    public async store({request, response} : HttpContextContract) {
        const body = request.body()
        const message = await Message.create(body)

        response.status(201)

        return {
            message: 'Message sucessfully created!',
            data: message,
        }
    }

    public async index() {
        const messages = await Message.query()
        .orderBy('task', 'asc')
        return {
            data: messages
        }
    }

    public async getMessageByActivity ({ params }: HttpContextContract) {
        const activityID = params.activity_id
        const activityMessages = await Message.query().where('activity_id', activityID).orderBy('created_at', 'asc')
        return activityMessages
    }
}
