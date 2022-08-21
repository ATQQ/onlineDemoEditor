import { RouterController, Post, ReqBody, Get, FWRequest } from 'flash-wolves'
import { getUserInfo } from '@/utils/userUtil'
import { createDefaultDemo, findDemo } from '@/db/demoDb'

@RouterController('api/demo')
export default class DemoController {
  private filterDemo(list: any) {
    return list.map((item: any) => {
      delete item._id
      return item
    })
  }

  @Get('list', { requiresAuth: true })
  async demoList(req: FWRequest) {
    const user = await getUserInfo(req)
    return findDemo({
      userId: user.id
    }).then((list) => {
      return this.filterDemo(list)
    })
  }

  @Post('create', { requiresAuth: true })
  async createDemo(@ReqBody('title') title: string, req: FWRequest) {
    const user = await getUserInfo(req)
    const demo: any = await createDefaultDemo(user.id, title)
    delete demo._id
    return demo
  }
}
