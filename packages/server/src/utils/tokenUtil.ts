import { User } from '@/db/model'
import { expiredRedisKey, getRedisVal, setRedisValue } from '@/db/redisDb'
import { encryption } from './stringUtil'
/**
 * Token(身份令牌)工具类
 */
class TokenUtil {
  /**
   * 生成token
   */
  createToken(user: User, timeout = 60 * 60 * 24 * 365) {
    const { username, id } = user
    const token = encryption([username, id, Date.now()].join())
    setRedisValue(token, JSON.stringify(user), timeout)
    return token
  }

  expiredToken(token: string) {
    expiredRedisKey(token)
  }

  async getUserInfo(token: string): Promise<User> {
    const v = await getRedisVal(token)
    if (v) {
      return JSON.parse(v)
    }
    return null as any
  }

  // eslint-disable-next-line no-use-before-define
  static instance: TokenUtil = null as any

  static getInstance() {
    if (!this.instance) {
      this.instance = new TokenUtil()
    }
    return this.instance
  }
}

export default TokenUtil.getInstance()
