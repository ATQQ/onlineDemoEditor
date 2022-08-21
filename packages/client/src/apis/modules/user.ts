import type { UserApiTypes } from '@share/dts/api'
import ajax from '../ajax'

function login(username: string, password: string): UserApiTypes.login {
  return ajax.post('user/login', {
    username,
    password
  })
}

function check() {
  return ajax.get('user/check')
}
function logOut(): Promise<any> {
  return ajax.post('user/logout')
}

export default {
  login,
  logOut,
  check
}
