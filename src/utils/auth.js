import Cookies from 'js-cookie'

// 定义 Token 在 Cookie 中的键名
const TokenKey = 'loginToken'
const authorityKey = 'authority'
// 获取 Token
export function getToken() {
  const token = Cookies.get('loginToken')

  return token && token.trim() !== '' ? token : null
}

// 设置 Token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除 Token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取权限
export function getAuthority() {
  const authority = Cookies.get('authority')
  return authority && authority.trim() !== '' ? authority : null
}

// 设置权限
export function setAuthority(authority) {
  return Cookies.set(authorityKey, authority)
}

// 删除权限
export function removeAuthority() {
  return Cookies.remove(authorityKey)
}
