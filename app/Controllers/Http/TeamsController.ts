import {v4 as uuidv4} from 'uuid'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Team from 'App/Models/Team'

import Application from "@ioc:Adonis/Core/Application"

export default class TeamsController {
    private validationOptions = {
        types: ["image"],
        size: "2mb"
    }

    public async store({request, response} : HttpContextContract) {
        const body = request.body()
        const image = request.file('logo', this.validationOptions)

        if(image) {
            const imageName = `${uuidv4()}.${image.extname}`

            await image.move(Application.tmpPath('uploads'), {
                name: imageName
            })

            body.logo = imageName
        }

        const team = await Team.create(body)

        response.status(201)

        return {
            message: 'Team sucessfully created!',
            data: team,
        }
    }

    public async index() {
        const teams = await Team.query()
        .orderBy('team', 'asc')
        return {
            data: teams
        }
    }

    public async show({params}: HttpContextContract) {

        const team = await Team.findOrFail(params.id)

        return {
            data: team
        }
    }

    public async destroy({params}: HttpContextContract) {
        const team = await Team.findOrFail(params.id)
        await team.delete()

        return {
            message: 'Team sucessfully deleted!',
            data: team
        }
    }

    public async update({params, request}: HttpContextContract) {

        const body = request.body()
        const team = await Team.findOrFail(params.id)

        team.team = body.team

        if(team.logo != body.logo || !team.logo) {
            const image = request.file('logo', this.validationOptions)

            if(image) {
                const imageName = `${uuidv4()}.${image.extname}`
    
                await image.move(Application.tmpPath('uploads'), {
                    name: imageName
                })
    
                team.logo = imageName
            }
        }
        await team.save()

        return {
            message: 'Team sucessfully updated!',
            data: team
        }
    }
}
