import copy from 'clipboard-copy'
import { ElMessage } from 'element-plus'

export function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 将结果写入的剪贴板
 * @param {String} text
 */
export function copyRes(text: string, msg = '结果已成功复制到剪贴板') {
  // 第三方
  copy(text)
    .then(() => {
      if (msg) {
        ElMessage.success(msg)
      }
    })
    .catch(() => {
      ElMessage.warning('不支持自动复制，请手动选择复制')
    })
}
