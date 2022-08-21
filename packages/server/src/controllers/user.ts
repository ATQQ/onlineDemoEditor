import {
  RouterController,
  Post,
  ReqBody,
  Response,
  Get,
  FWRequest,
  Delete
} from 'flash-wolves'
import { addUser, findUser } from '@/db/userDb'
import { encryption } from '@/utils/stringUtil'
import tokenUtil from '@/utils/tokenUtil'
import { getUserInfo } from '@/utils/userUtil'
import { createDefaultDemo } from '@/db/demoDb'

@RouterController('api/user')
export default class User {
  @Post('login')
  async login(
    @ReqBody('username') username: string,
    @ReqBody('password') password: string
  ) {
    let user = (
      await findUser({
        username
      })
    )[0]
    // 账号不存在，直接注册
    if (!user) {
      await addUser({
        username,
        password: encryption(password)
      })
      ;[user] = await findUser({
        username
      })
      await createDefaultDemo(user.id)
    } else if (user.password !== encryption(password)) {
      return Response.failWithError({ code: 401, msg: '密码错误' })
    }
    return {
      token: tokenUtil.createToken(user),
      id: user.id,
      username: user.username
    }
  }

  @Get('check', { requiresAuth: true })
  async check(req: FWRequest) {
    const user = await getUserInfo(req)
    return {
      id: user.id,
      username: user.username
    }
  }

  @Delete('logout', { requiresAuth: true })
  async logout(req: FWRequest) {
    tokenUtil.expiredToken(req.headers?.token as string)
  }
}
