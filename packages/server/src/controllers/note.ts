import {
  RouterController,
  ReqBody,
  Get,
  FWRequest,
  ReqParams,
  Put
} from 'flash-wolves'
import { getUserInfo } from '@/utils/userUtil'
import { Note } from '@/db/model'
import { findNote, updateNote } from '@/db/noteDb'
import {
  getUploadToken,
  previewStyle,
  privateBucketDomain
} from '@/utils/qiniuUtil'

@RouterController('api/note')
export default class NoteController {
  @Get(':id', { requiresAuth: true })
  async noteDetail(@ReqParams('id') id: string, req: FWRequest) {
    const user = await getUserInfo(req)
    const [detail] = await findNote({
      id,
      userId: user.id
    })

    return {
      data: detail.data,
      id: detail.id
    }
  }

  @Put(':id', { requiresAuth: true })
  async updateDetail(
    @ReqParams('id') id: string,
    @ReqBody() body: Note['data'],
    req: FWRequest
  ) {
    const user = await getUserInfo(req)
    await updateNote(
      {
        id,
        userId: user.id
      },
      {
        $set: {
          data: body
        }
      }
    )
  }

  @Get('upload/token', { requiresAuth: true })
  async uploadToken() {
    const token = await getUploadToken()
    const domain = privateBucketDomain
    const minify = previewStyle
    return {
      token,
      domain,
      minify
    }
  }
}
