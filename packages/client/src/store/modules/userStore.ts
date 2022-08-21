import { defineStore } from 'pinia'

const useStore = defineStore('user', {
  state: () => ({
    account: '',
    token: '',
    isLogin: false,
    userId: 0
  }),
  actions: {
    async checkUserStatus() {
      // 调用接口更新状态
    }
  }
})

export default useStore
