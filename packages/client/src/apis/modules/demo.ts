import type { DemoApiTypes } from '@share/dts/api'
import ajax from '../ajax'

function demoList(): DemoApiTypes.demoList {
  return ajax.get('demo/list')
}

function createDemo(title: string): DemoApiTypes.createDemo {
  return ajax.post('demo/create', {
    title
  })
}
function shareDemo(id: string, status: boolean) {
  return ajax.put(`demo/share/${id}`, {
    status
  })
}
function getShareData(id: string): DemoApiTypes.shareData {
  return ajax.get(`demo/share/${id}`)
}
function forkDemo(id: string): ResponseData<{
  id: string
}> {
  return ajax.post(`demo/share/fork/${id}`)
}
export default {
  demoList,
  createDemo,
  shareDemo,
  getShareData,
  forkDemo
}
