import request from '@/utils/request'

//登录
export function login(loginName, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      loginName,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}


// /user/showAllUsers-显示所有用户列表
export function fetchList(data) {
  return request({
    url: '/admin/user/showAllUsers',
    method: 'post',
    data: data
  })
}

// /user/disableUsers-禁用用户
// /admin/user/disableUsers
import store from '../store'

export function disableUsers(data) {
  return request({
    url: '/admin/user/disableUsers',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 替换成实际的 authority 值
    }
  })
}

// /user/ableUsers-启用用户
// /admin/user/ableUsers
export function ableUsers(data) {
  return request({
    url: '/admin/user/ableUsers',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 替换成实际的 authority 值
    }
  })
}