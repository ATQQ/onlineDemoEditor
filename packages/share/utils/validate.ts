export function validateUsername(value: string) {
  return /^\w{6,16}$/.test(value)
}

export function validatePassword(value: string) {
  return /^\w{6,16}$/.test(value)
}
