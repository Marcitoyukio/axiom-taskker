import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import UserTeam from 'App/Models/UserTeam'
import Redis from 'Config/redis'

export default class UserTeamsController {
    public async store({ request, response }: HttpContextContract) {
        const data = request.only(['user_id', 'team_id'])
        const userTeam = await UserTeam.create(data)

        const teamID = data.team_id
        await Redis.del(`teamUsers:${teamID}`)

        response.status(201)

        return {
            message: 'User successfully linked with a team!',
            data: userTeam,
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        const userTeam = await UserTeam.query()
            .where('user_id', params.user_id)
            .where('team_id', params.team_id)
            .firstOrFail()

        const teamID = params.team_id
        await Redis.del(`teamUsers:${teamID}`)

        await userTeam.delete()

        response.status(201)

        const cacheKey = `teamUsers:${params.team_id}`
        await Redis.del(cacheKey)

        return {
            message: 'User link with team successfully deleted!',
            data: userTeam,
        }
    }

    public async getTeamsByUser({ params }: HttpContextContract) {
        const userId = params.user_id
        const user = await User.findOrFail(userId)
        const userTeams = await user.related('teams').query().orderBy('team', 'asc')
        return userTeams
    }

    public async getUsersByTeam({ params }: HttpContextContract) {
        const teamID = params.team_id
        const team = await Team.findOrFail(teamID)

        const cacheKey = `teamUsers:${teamID}`
        const cachedTeamUsers = await Redis.get(cacheKey)

        if (cachedTeamUsers) {
            return JSON.parse(cachedTeamUsers)
        }

        const teamUsers = await team.related('users').query().orderBy('name', 'asc')
        await Redis.setex(cacheKey, 3600, JSON.stringify(teamUsers))

        return teamUsers
    }

    public async removeUserTeams({ params }: HttpContextContract) {
        const userId = params.user_id
        const user = await User.findOrFail(userId)
        const userTeams = await user.related('teams').query()
        if (userTeams) {
            userTeams.forEach(async (team) => {
                const userTeam = await UserTeam.query()
                    .where('user_id', userId)
                    .where('team_id', team.id)
                    .firstOrFail()
                await userTeam.delete()

                const cacheKey = `teamUsers:${team.id}`
                await Redis.del(cacheKey)
            })
        }
    }
}
