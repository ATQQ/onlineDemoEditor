function validateUsername(value: string) {
  return /^\w{6,16}$/.test(value)
}

function validatePassword(value: string) {
  return /^\w{6,16}$/.test(value)
}
