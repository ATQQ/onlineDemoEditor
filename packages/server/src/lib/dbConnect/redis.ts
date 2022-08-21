import redis, { RedisClient } from 'redis'
import { redisConfig } from '@/config'

const { port, host } = redisConfig

export function getClient(): Promise<RedisClient> {
  return new Promise<RedisClient>((res, rej) => {
    const client = redis.createClient(port, host)
    // redis 服务器启动
    client.on('ready', () => {
      res(client)
    })
    client.on('error', (err) => {
      client.quit()
      rej(err)
    })
  })
}
