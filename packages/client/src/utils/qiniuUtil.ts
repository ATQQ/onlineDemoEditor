import * as qiniu from 'qiniu-js'

export function getRandomKey() {
  return Math.random().toString(36).slice(2)
}

export function qiniuUpload(token: string, file: File, key: string) {
  const observable = qiniu.upload(file, key, token)
  return new Promise((resolve, rej) => {
    const subscription = observable.subscribe({
      next(res) {
        const {
          total: { percent }
        } = res
      },
      error(err) {
        rej(err)
      },
      complete(res) {
        resolve(res)
      }
    })
    // subscription.close() // 取消上传
  })
}
