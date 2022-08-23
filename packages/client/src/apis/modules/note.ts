import type { Note } from '@server/db/model'
import type { NoteApiTypes } from '@share/dts/api'
import ajax from '../ajax'

function getNodeDetail(id: string): NoteApiTypes.noteDetail {
  return ajax.get(`note/${id}`)
}

function updateDetail(id: string, body: Note['data']) {
  return ajax.put(`note/${id}`, body)
}

function getUploadToken(): ResponseData<{
  token: string
  domain: string
  minify: string
}> {
  return ajax.get('note/upload/token')
}

export default {
  getNodeDetail,
  updateDetail,
  getUploadToken
}
