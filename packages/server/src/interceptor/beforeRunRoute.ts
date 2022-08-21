import type { FWRequest, FWResponse } from 'flash-wolves'
import { getUserInfo } from '../utils/userUtil'

export default async function beforeRunRoute(req: FWRequest, res?: FWResponse) {
  const meta = req.route?.meta
  if (!meta || Object.keys(meta).length === 0) return
  const { requiresAuth } = meta

  if (requiresAuth && (!req.headers.token || !(await getUserInfo(req)))) {
    res?.failWithError({ code: 401, msg: '请先登录' })
  }
}
