import { asyncRouterMap, constantRouterMap } from '@/router/index';
const forbiddenRoutesForAll = [
  '/product/addProduct',
  '/ums/admin',
  '/vote/addVote',
  '/nft/addNft'
];
import store from '../index';
//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.path) {
    const authority = localStorage.getItem('authority') || store.getters.authority;
    if (authority !== 'all' && forbiddenRoutesForAll.includes('/' + route.path)) {
      return false; // 注意要补一个 '/'，因为 route.path 是不带 /
    }

    let currMenu = getMenu(route.name, menus);
    if (currMenu != null) {
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if (currMenu.hidden != null) {
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort = -1;
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
}

//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name === menu.name) {
      return menu;
    }
  }
  return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if (router.children && router.children.length > 0) {
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p) {
  return function (m, n) {
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { menus } = data;
        // const { username } = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          const menus = data.menus;
          //admin帐号直接返回所有菜单
          // if(username==='admin') return true;
          if (hasPermission(menus, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menus, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return true;
        });
        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

