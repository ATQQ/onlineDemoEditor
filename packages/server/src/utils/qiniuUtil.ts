/* eslint-disable */
import { qiniuConfig } from '@/config'
import qiniu from 'qiniu'
// [node-sdk文档地址](https://developer.qiniu.com/kodo/1289/nodejs#server-upload)
export const privateBucketDomain =
  qiniuConfig.bucketDomain || 'https://img.cdn.sugarat.top'

export const previewStyle = qiniuConfig.imagePreviewStyle || ''

let bucket = qiniuConfig.bucketName
let mac = new qiniu.auth.digest.Mac(
  qiniuConfig.accessKey,
  qiniuConfig.secretKey
)
/**
 * 获取OSS上文件的下载链接（默认12h有效）
 * @param key 文件的key
 * @param expiredTime
 */
export function createDownloadUrl(key: string): string {
  // 七牛云相关
  const config = new qiniu.conf.Config()
  // 鉴权的内容，请求的时候生成，避免过期
  const bucketManager = new qiniu.rs.BucketManager(mac, config)

  return bucketManager.publicDownloadUrl(privateBucketDomain, key)
}

export function getUploadToken(): string {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    // returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize)}'
  })
  return putPolicy.uploadToken(mac)
}
