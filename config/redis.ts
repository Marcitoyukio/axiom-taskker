import Env from '@ioc:Adonis/Core/Env'
import Redis from 'ioredis'

const redisConfig = {
  host: Env.get('REDIS_HOST'),
  port: Env.get('REDIS_PORT'), 
  password: Env.get('REDIS_PASSWORD'),
  tls: { servername: Env.get('REDIS_HOST') }, 
}

const redis = new Redis(redisConfig)

export default redis
