import request from '@/utils/request'
import store from '../store'

// /nft/addNewMintNFT   这个接口是管理后台插入一些丢失的nft交易
export function addNewMintNFT(data) {
  return request({
    url: '/admin/nft/addNewMintNFT',
    method: 'post',
    data: data,
    headers: {
      authority: store.getters.authority // 
    }
  })
}



