import Env from '@ioc:Adonis/Core/Env'

export const azureConfig = {
    connectionString: Env.get('AZURE_USER_STORAGE_KEY'),
    containerName: Env.get('AZURE_USER_STORAGE_CONTAINER'), 
};