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


/**
 * 上传图片接口封装
 * @param {File} file - 要上传的图片文件
 * @returns {Promise} - 返回图片上传后的服务器响应
 */
export function insertNewGoods({ imageFile, coverFile, ...extraData }) {
  const formData = new FormData();

  console.log('当前 image:', imageFile);
  console.log('是否是 File 实例:', imageFile instanceof File);

  if (imageFile) formData.append('image', imageFile);
  if (coverFile) formData.append('cover', coverFile);

  for (const key in extraData) {
    if (extraData[key] != null) {
      formData.append(key, extraData[key]);
    }
  }

  return request({
    url: '/admin/shop/insertNewGoods',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      authority: store.getters.authority
    }
  });
}


// /shop/insertNewGoods-添加最新商品

// export function insertNewGoodsOld(data) {
//   return request({
//     url: '/admin/shop/insertNewGoods',
//     method: 'post',
//     data: data,
//     headers: {
//       authority: authority // 替换成实际的 authority 值
//     }
//   })
// }

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