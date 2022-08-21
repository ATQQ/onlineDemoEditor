import type { Code } from '@server/db/model'
import type { CodeApiTypes } from '@share/dts/api'
import ajax from '../ajax'

function codeDetail(id: string): CodeApiTypes.codeDetail {
  return ajax.get(`code/${id}`)
}

function updateDetail(id: string, body: Partial<Code>) {
  return ajax.put(`code/${id}`, body)
}

export default {
  codeDetail,
  updateDetail
}
