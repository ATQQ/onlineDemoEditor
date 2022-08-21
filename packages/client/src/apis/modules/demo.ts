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

export default {
  demoList,
  createDemo
}
