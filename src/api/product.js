import request from '@/utils/request'
// /shop/getGoodsList-管理员获取商品列表
export function fetchList(data) {
  return request({
    url: '/admin/shop/getGoodsList',
    method: 'post',
    data: data,
  })
}
import store from '../store'
const authority = store.getters.authority // 从store中获取authority

// /shop/insertNewGoods-添加最新商品

export function insertNewGoods(data) {
  return request({
    url: '/admin/shop/insertNewGoods',
    method: 'post',
    data: data,
    headers: {
      authority: authority // 替换成实际的 authority 值
    }
  })
}

// /shop/disableGoods-下架商品
export function disableGoods(data) {
  return request({
    url: '/admin/shop/disableGoods',
    method: 'post',
    data: data,
    headers: {
      authority: authority // 替换成实际的 authority 值
    }
  })
}
// /shop/ableGoods-上架商品

export function ableGoods(data) {
  return request({
    url: '/admin/shop/ableGoods',
    method: 'post',
    data: data,
    headers: {
      authority: authority // 替换成实际的 authority 值
    }
  })
}

// /shop/modifyGoodsPrice-修改商品单价
export function modifyGoodsPrice(data) {
  return request({
    url: '/admin/shop/modifyGoodsPrice',
    method: 'post',
    data: data,
    headers: {
      authority: authority // 替换成实际的 authority 值
    }
  })
}

// /shop/modifyGoodsAmount // 修改商品数量

export function modifyGoodsAmount(data) {
  return request({
    url: '/admin/shop/modifyGoodsAmount',
    method: 'post',
    data: data,
    headers: {
      authority: authority // 替换成实际的 authority 值
    }
  })
}