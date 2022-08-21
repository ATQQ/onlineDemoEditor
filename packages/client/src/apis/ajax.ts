import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL
})

/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
  const { method, params } = config
  // 附带鉴权的token
  const headers: any = {
    token: localStorage.getItem('token')
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {}
    })
  }

  return {
    ...config,
    headers
  }
})

/**
 * 响应拦截
 */
instance.interceptors.response.use(
  (v) => {
    if (v.status === 200) {
      let err = ''
      if (v.data?.code === 401) {
        localStorage.removeItem('token')
        // 登录状态修改
        const $userStore = useUserStore()
        $userStore.$patch({
          token: '',
          isLogin: false,
          userId: '',
          username: ''
        })
        err = v.data.msg
      }
      if (v.data?.code !== 0) {
        err = v.data.msg
      }
      if (err) {
        ElMessage.error(err)
        return Promise.reject(v)
      }
      return v.data
    }
    ElMessage.error(v.statusText)
    return Promise.reject(v)
  },
  (err) => {
    ElMessage.error(`网络错误：${err}`)
    return Promise.reject(err)
  }
)
export default instance
