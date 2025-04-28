import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getAuthority, setAuthority, removeAuthority } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    authority: getAuthority(),
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_AUTHORITY: (state, authority) => {
      state.authority = authority
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response
          console.log(data)
          const tokenStr = data.json.adminToken
          setToken(tokenStr)
          setAuthority(data.json.authority)
          commit('SET_TOKEN', tokenStr)
          commit('SET_AUTHORITY', data.json.authority)
          resolve()
        }).catch(error => {
          console.error("Login error:", error);
          reject(error)
        })
      })
    },

    // 获取用户信息,登录
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const data = {
          "roles": [
            "超级管理员"
          ],
          "icon": "https://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/icon/github_icon_01.png",
          "menus": [
            {
              "id": 1,
              "parentId": 0,
              "createTime": "2020-02-02T06:50:36.000+00:00",
              "title": "商品",
              "level": 0,
              "sort": 0,
              "name": "pms",
              "icon": "product",
              "hidden": 0
            },
            {
              "id": 2,
              "parentId": 1,
              "createTime": "2020-02-02T06:51:50.000+00:00",
              "title": "商品列表",
              "level": 1,
              "sort": 0,
              "name": "product",
              "icon": "product-list",
              "hidden": 0
            },
            {
              "id": 3,
              "parentId": 1,
              "createTime": "2020-02-02T06:52:44.000+00:00",
              "title": "添加商品",
              "level": 1,
              "sort": 0,
              "name": "addProduct",
              "icon": "product-add",
              "hidden": 0
            },


            {
              "id": 7,
              "parentId": 0,
              "createTime": "2020-02-02T08:54:07.000+00:00",
              "title": "订单",
              "level": 0,
              "sort": 0,
              "name": "oms",
              "icon": "order",
              "hidden": 0
            },
            {
              "id": 8,
              "parentId": 7,
              "createTime": "2020-02-02T08:55:18.000+00:00",
              "title": "订单列表",
              "level": 1,
              "sort": 0,
              "name": "order",
              "icon": "product-list",
              "hidden": 0
            },
            {
              "id": 21,
              "parentId": 0,
              "createTime": "2020-02-07T08:29:13.000+00:00",
              "title": "权限",
              "level": 0,
              "sort": 0,
              "name": "ums",
              "icon": "ums",
              "hidden": 0
            },
            {
              "id": 22,
              "parentId": 21,
              "createTime": "2020-02-07T08:29:51.000+00:00",
              "title": "用户列表",
              "level": 1,
              "sort": 0,
              "name": "admin",
              "icon": "ums-admin",
              "hidden": 0
            },
            {
              "id": 23,
              "parentId": 0,
              "createTime": "2020-02-07T08:29:51.000+00:00",
              "title": "投票",
              "level": 0,
              "sort": 0,
              "name": "vote",
              "icon": "vote-icon",
              "hidden": 0
            },
            {
              "id": 24,
              "parentId": 23,
              "createTime": "2020-02-07T08:29:51.000+00:00",
              "title": "投票列表",
              "level": 1,
              "sort": 0,
              "name": "voteList",
              "icon": "product-list",
              "hidden": 0
            },
            {
              "id": 25,
              "parentId": 23,
              "createTime": "2020-02-02T06:52:44.000+00:00",
              "title": "插入池子",
              "level": 1,
              "sort": 0,
              "name": "addVote",
              "icon": "product-add",
              "hidden": 0
            },
            {
              "id": 26,
              "parentId": 0,
              "createTime": "2020-02-07T08:29:51.000+00:00",
              "title": "NFT",
              "level": 0,
              "sort": 0,
              "name": "nft",
              "icon": "nft-icon",
              "hidden": 0
            },
            {
              "id": 27,
              "parentId": 26,
              "createTime": "2020-02-07T08:29:51.000+00:00",
              "title": "NFT列表",
              "level": 1,
              "sort": 0,
              "name": "nftList",
              "icon": "nft-icon",
              "hidden": 0
            },
            {
              "id": 28,
              "parentId": 26,
              "createTime": "2020-02-02T06:52:44.000+00:00",
              "title": "插入NFT池子",
              "level": 1,
              "sort": 0,
              "name": "addNft",
              "icon": "product-add",
              "hidden": 0
            },

          ],
          "username": "admin"
        }
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.icon)
        resolve(data)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        commit('SET_AUTHORITY', '')
        removeAuthority()
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_AUTHORITY', '')
        removeAuthority()
        removeToken()
        resolve()
      })
    }
  }
}

export default user
