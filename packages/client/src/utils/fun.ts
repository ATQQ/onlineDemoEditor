export function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function (...args:any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}