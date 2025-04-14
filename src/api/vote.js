import request from '@/utils/request'
import store from '../store'

///vote/observerWahlPool  获取投票池
export function observerWahlPool(data) {
  return request({
    url: '/admin/vote/observerWahlPool',
    method: 'post',
    data: data,

  })
}
// /vote/insertNewWahlPool 新增投票池
export function insertNewWahlPool(data) {
  return request({
    url: '/admin/vote/insertNewWahlPool',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 
    }
  })
}

// /vote/terminateWahlPool 终止投票池
export function terminateWahlPool(data) {
  return request({
    url: '/admin/vote/terminateWahlPool',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority //
    }
  })
}


