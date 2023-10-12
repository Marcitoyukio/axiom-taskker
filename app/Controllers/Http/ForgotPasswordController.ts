import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EmailClient } from '@azure/communication-email'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

class ForgotPasswordController {
  public async sendToken({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const user = await User.findBy('email', email)

      if (!user) {
        return response.status(400).send({ message: 'Email not found.' })
      }

      const token = Math.floor(100000 + Math.random() * 900000).toString()
      user.token = token
      await user.save()

      const emailClient = new EmailClient(Env.get('AZURE_EMAIL_CONNECTION_STRING'))
      const message = {
        senderAddress: "DoNotReply@d9040119-bf2c-4b36-92cc-06f6d82acf1c.azurecomm.net",
        content: {
          subject: "Redefinição de Senha - Axiom Taskker",
          plainText: `Olá ${user.name}, aqui está o seu token para o reset de senha: ${token}, utilize-o em até 5 minutos!`,
        },
        recipients: {
          to: [
            {
              address: `${user.email}`,
            },
          ],
        },
      };
  
      await emailClient.beginSend(message)

      return response.status(200).send({ message: 'Password reset email sent.' })
    } catch (error) {
      return response.status(500).send({ message: 'An error occurred.' })
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    try {
      const { email, token, password } = request.all()
      const user = await User.findBy('email', email)

      if (!user) {
        return response.status(400).send({ message: 'Usuário não localizado!' })
      }

      if (!user.token || (DateTime.now().diff(user.tokenCreatedAt).as('milliseconds')) > 300000) {
        return response.status(400).send({ message: 'Token expirado, tente novamente!' })
      }
    
      if (token == user.token) {
        user.password = password
        user.token = 'null'
        user.tokenCreatedAt = DateTime.fromJSDate(new Date(0));
        await user.save()
      }

      return response.status(200).send({ message: 'Password reset successfully.' })
    } catch (error) {
      return response.status(500).send({ message: 'An error occurred.' })
    }
  }
}

export default ForgotPasswordController
