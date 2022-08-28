import {
  RouterController,
  Post,
  ReqBody,
  Get,
  FWRequest,
  Put,
  ReqParams,
  Response
} from 'flash-wolves'
import { getUserInfo } from '@/utils/userUtil'
import { createDefaultDemo, findDemo, updateDemo } from '@/db/demoDb'
import { findNote, updateNote } from '@/db/noteDb'
import { findCode, updateCode } from '@/db/codeDb'

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

  @Put('share/:id', { requiresAuth: true })
  async shareDemo(
    @ReqBody('status') status: boolean,
    @ReqParams('id') id: string,
    req: FWRequest
  ) {
    const user = await getUserInfo(req)
    await updateDemo(
      {
        userId: user.id,
        id
      },
      {
        $set: {
          share: !!status
        }
      }
    )
  }

  @Get('share/:id')
  async getShareDemoData(@ReqParams('id') id: string) {
    const demo = (
      await findDemo({
        id
      })
    )[0]
    if (!demo || !demo?.share) {
      return {
        code: {
          html: '',
          css: '',
          js: ''
        },
        note: {
          blocks: []
        },
        share: false
      }
    }
    const note = (
      await findNote({
        id: demo.noteId
      })
    )[0]
    const code = (
      await findCode({
        id: demo.codeId
      })
    )[0]

    return {
      note: note.data,
      code: {
        css: code.css,
        js: code.js,
        html: code.html
      },
      share: true
    }
  }

  @Post('share/fork/:id', { requiresAuth: true })
  async forkShareDemo(@ReqParams('id') id: string, req: FWRequest) {
    const user = await getUserInfo(req)

    // 先判断是否可以fork
    const originDemo = (
      await findDemo({
        id
      })
    )[0]
    if (!originDemo?.share) {
      return Response.fail(500, '已停止分享，不可以fork')
    }
    // 禁止套娃
    if (originDemo.userId === user.id) {
      return Response.fail(500, '禁止套娃，不能fork自己的笔记')
    }
    // 判断是否已经fork
    const alreadyFork = !!(
      await findDemo({
        userId: user.id,
        forkFrom: originDemo.id
      })
    )[0]
    if (alreadyFork) {
      return Response.fail(500, '已经fork过此笔记！！')
    }
    const originNote = (
      await findNote({
        id: originDemo.noteId
      })
    )[0]
    const originCode = (
      await findCode({
        id: originDemo.codeId
      })
    )[0]

    // 创建1个
    const newDemo = await createDefaultDemo(
      user.id,
      originDemo.title,
      originDemo.id
    )
    // 将别人更新进去
    updateNote(
      {
        id: newDemo.noteId
      },
      {
        $set: {
          data: originNote.data
        }
      }
    )
    await updateCode(
      {
        id: newDemo.codeId
      },
      {
        $set: {
          css: originCode.css,
          html: originCode.html,
          js: originCode.js
        }
      }
    )
    return {
      id: newDemo.id
    }
  }
}
