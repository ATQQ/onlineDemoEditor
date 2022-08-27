import { defineStore } from 'pinia'
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
      return userAPI.login(username, password).then((res) => {
        this.username = res.data.username
        this.token = res.data.token
        this.isLogin = true
        this.userId = res.data.id
        localStorage.setItem('token', res.data.token)
      })
    },
    async checkUserStatus() {
      if (!this.token) {
        return false
      }
      return userAPI
        .check()
        .then((res) => {
          this.username = res.data.username
          this.isLogin = true
          this.userId = res.data.id
          return true
        })
        .catch(() => {
          this.isLogin = false
          return false
        })
    },
    logout() {
      return userAPI.logout().then(() => {
        this.token = ''
        this.username = ''
        this.isLogin = false
        this.userId = ''
        localStorage.removeItem('token')
      })
    }
  }
})

export default useStore
