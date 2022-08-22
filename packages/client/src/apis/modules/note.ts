import type { Note } from '@server/db/model'
import type { NoteApiTypes } from '@share/dts/api'
import ajax from '../ajax'

function getNodeDetail(id: string): NoteApiTypes.noteDetail {
  return ajax.get(`note/${id}`)
}

function updateDetail(id: string, body: Note['data']) {
  return ajax.put(`note/${id}`, body)
}

export default {
  getNodeDetail,
  updateDetail
}
