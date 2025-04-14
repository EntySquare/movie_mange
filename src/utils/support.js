import Cookies from "js-cookie";
// 这行代码定义了一个常量 SupportKey，并将它设置为 'supportKey'。
// 这个常量在接下来的代码中作为 cookie 的键名使用。
// 这意味着在代码中，当你设置或获取名为 'supportKey' 的 cookie 时，都会用这个常量。
const SupportKey='supportKey';

// v
export function getSupport() {
  return Cookies.get(SupportKey)
}

export function setSupport(isSupport) {
  return Cookies.set(SupportKey, isSupport,{ expires: 3 })
}

export function setCookie(key,value,expires) {
  return Cookies.set(key, value,{ expires: expires})
}

export function getCookie(key) {
  return Cookies.get(key)
}
