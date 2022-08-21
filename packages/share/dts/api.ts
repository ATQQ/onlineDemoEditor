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
