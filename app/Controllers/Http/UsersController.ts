import {v4 as uuidv4} from 'uuid'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

import { BlobServiceClient } from '@azure/storage-blob';
import { azureConfig } from 'Config/azureConfig';

export default class UsersController {
    private validationOptions = {
        types: ["image"],
        size: "2mb"
    }

    public async store({request, response} : HttpContextContract) {
        const body = request.body()
        const image = request.file('photo', this.validationOptions)

        if(image) {
            const imageName = `${uuidv4()}.${image.extname}`

            const blobServiceClient = BlobServiceClient.fromConnectionString(azureConfig.connectionString);
            const containerClient = blobServiceClient.getContainerClient(azureConfig.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(imageName);

            if (image.tmpPath) 
                await blockBlobClient.uploadFile(image.tmpPath)
            
            body.photo = imageName
        }

        const user = await User.create(body)

        response.status(201)

        return {
            message: 'User sucessfully created!',
            data: user,
        }
    }

    public async index() {
        const users = await User.query()
        .orderBy('name', 'asc')
        return {
            data: users
        }
    }

    public async show({params}: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        return {
            data: user
        }
    }

    public async destroy({params}: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return {
            message: 'User sucessfully deleted!',
            data: user
        }
    }

    public async update({params, request}: HttpContextContract) {

        const body = request.body()
        const user = await User.findOrFail(params.id)

        user.name = body.name
        user.email = body.email
        user.password = body.password
        user.profile = body.profile

        if(user.photo != body.logo || !user.photo) {
            const image = request.file('photo', this.validationOptions)

            if(image) {
                const imageName = `${uuidv4()}.${image.extname}`
    
                const blobServiceClient = BlobServiceClient.fromConnectionString(azureConfig.connectionString);
                const containerClient = blobServiceClient.getContainerClient(azureConfig.containerName);

                if (user.photo) {
                    const deleteBlobClient = containerClient.getBlockBlobClient(user.photo.toString());
                    await deleteBlobClient.delete()
                }
                
                const blockBlobClient = containerClient.getBlockBlobClient(imageName);
                if (image.tmpPath) 
                await blockBlobClient.uploadFile(image.tmpPath)

                user.photo = imageName
            }
        }
        await user.save()

        return {
            message: 'User sucessfully updated!',
            data: user
        }
    }

    public async getUserByEmail({params}: HttpContextContract) {
        const user = await User.query().where('email', params.email).firstOrFail()
        return {
            data: [{id: user.id, name: user.name, photo: user.photo, role: user.profile}]
        }
    }
}
