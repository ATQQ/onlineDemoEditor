import {
  RouterController,
  ReqBody,
  Get,
  FWRequest,
  ReqParams,
  Put
} from 'flash-wolves'
import { getUserInfo } from '@/utils/userUtil'
import { findCode, updateCode } from '@/db/codeDb'
import { Code } from '@/db/model'

@RouterController('api/code')
export default class CodeController {
  @Get(':id', { requiresAuth: true })
  async codeDetail(@ReqParams('id') id: string, req: FWRequest) {
    const user = await getUserInfo(req)
    const [detail] = await findCode({
      id,
      userId: user.id
    })

    return {
      js: detail.js,
      html: detail.html,
      css: detail.css
    }
  }

  @Put(':id', { requiresAuth: true })
  async updateDetail(
    @ReqParams('id') id: string,
    @ReqBody() body: Code,
    req: FWRequest
  ) {
    const user = await getUserInfo(req)
    await updateCode(
      {
        id,
        userId: user.id
      },
      {
        $set: {
          js: body.js,
          html: body.html,
          css: body.css
        }
      }
    )
  }
}
