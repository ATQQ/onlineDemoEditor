import { Code, Demo } from '../../server/src/db/model'

// 接口的响应值类型定义
export declare namespace UserApiTypes {
  type login = ResponseData<{
    token: string
    id: string
    username: string
  }>

  type check = ResponseData<{
    id: string
    username: string
  }>
}

export declare namespace DemoApiTypes {
  type demoList = ResponseData<Demo[]>

  type createDemo = ResponseData<Demo>
}

export declare namespace CodeApiTypes {
  type codeDetail = ResponseData<Code>
}
