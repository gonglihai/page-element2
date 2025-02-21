/**
 * 默认 fetch 请求
 * @param {String} url 请求地址
 * @param {String} method 请求方法
 * @param {Object} params 请求参数
 * @returns Promise
 */
function f(url, method, params) {
  return new Promise((resolve, reason) => {

    const options = {
      method,
      headers: {},
    };

    // 请求参数
    if (params) {
      // 带 body 的, 设置 Content-Type 为 json, body 为参数
      if (['POST', 'PUT', 'PATCH', 'CONNECT', 'TRACE'].includes(method)) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(params);
      }
      // 不带 body 的, 设置 url 参数
      if (['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(method)) {
        url = url + (url.includes('?') ? '&' : '?') + Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
      }
    }

    fetch(url, options).then(response => response.json())
      .then(resolve)
      .catch(reason)
  })
}

export default {
  /**
   * get 方法
   * @param {String} uri    后端地址
   * @param {Object} params 请求参数
   * @returns Promise 下拉框数据
   */
  get(uri, params) {
    return f(uri, 'GET', params)
  },
  /**
   * post 请求
   * @param {String} uri   删除api
   * @param {Object} params 请求参数
   * @returns Promise 删除结果
   */
  post(uri, params) {
    return f(uri, 'POST', params)
  },
  /**
   * 删除方法
   * @param {String} uri   删除api
   * @param {Object} params 请求参数
   * @returns Promise 删除结果
   */
  delete(uri, params) {
    return f(uri, 'DELETE', params)
  },
}