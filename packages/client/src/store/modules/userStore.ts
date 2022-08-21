import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { userAPI } from '@/apis'

const useStore = defineStore('user', {
  state: () => ({
    username: '',
    token: localStorage.getItem('token') || '',
    isLogin: false,
    userId: ''
  }),
  actions: {
    async login(username: string, password: string) {
      userAPI.login(username, password).then((res) => {
        this.username = res.data.username
        this.token = res.data.token
        this.isLogin = true
        this.userId = res.data.id
        localStorage.setItem('token', res.data.token)
        ElMessage.success('登录成功')
      })
    },
    async checkUserStatus() {
      if (!this.token) {
        return
      }
      userAPI
        .check()
        .then((res) => {
          this.username = res.data.username
          this.isLogin = true
          this.userId = res.data.id
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  }
})

export default useStore
