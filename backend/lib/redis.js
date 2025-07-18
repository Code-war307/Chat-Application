import {createClient} from 'redis'

const redisUrl = process.env.REDIS_URL
const redis = createClient({url : redisUrl})
redis.on('error', (err) => console.error('Redis error occur : ',err))
redis.on('connect', () => console.log('Redis connected succesfully'))
await redis.connect()

export default redis
