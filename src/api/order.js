import request from '@/utils/request'

// shop/showAllPurchases-获取所有交易订单接口
// /admin/shop / showAllPurchases
export function fetchList(data) {
  return request({
    url: '/admin/shop/showAllPurchases',
    method: 'post',
    data: data
  })
}
import store from '../store'

// /shop/modifyPurchaseStatus--修改交易订单状态
// /admin/shop/modifyPurchaseStatus
export function modifyPurchaseStatus(data) {
  return request({
    url: '/admin/shop/modifyPurchaseStatus',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 替换成实际的 authority 值
    }
  })
}

// " /shop/deliverpurchase  //订单发货

export function deliverpurchase(data) {
  return request({
    url: '/admin/shop/deliverpurchase',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 替换成实际的 authority 值
    }
  })
}