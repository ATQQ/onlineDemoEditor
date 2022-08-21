import { getClient } from '@/lib/dbConnect/redis'

// 做一层业务缓存
import storage from '@/utils/storageUtil'

export function setRedisValue(k: string, v: string, expiredTime = -1) {
  storage.setItem(k, v, expiredTime)
  getClient().then((client) => {
    client.set(k, v, () => {
      if (expiredTime !== -1) {
        client.expire(k, expiredTime, () => {
          client.quit()
        })
        return
      }
      client.quit()
    })
  })
}

export function getRedisVal(k: string): Promise<string> {
  return new Promise((resolve) => {
    const v = storage.getItem(k)
    if (v?.value) {
      return resolve(v.value)
    }
    return getClient().then((client) => {
      client.get(k, (err, reply) => {
        storage.setItem(k, reply, 60 * 60 * 24)
        client.quit()
        return resolve(reply || '')
      })
    })
  })
}

export function getRedisValueJSON<T>(k: string, defaultValue: T): Promise<T> {
  return getRedisVal(k).then((v) => {
    if (v) {
      return JSON.parse(v)
    }
    return defaultValue || null
  })
}

export function expiredRedisKey(k: string) {
  setRedisValue(k, '', 0)
  storage.expireItem(k)
}
