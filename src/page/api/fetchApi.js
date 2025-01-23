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
      headers: {
        method,
      },
    };

    // 非 get 请求， 设置 Content-Type 为 json
    if (method != 'GET') {
      options.headers["Content-Type"] = "application/json";
    }

    // get 请求，拼接 url 参数
    if (method == 'GET' && params) {
      url = url + (url.includes('?') ? '&' : '?') + Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
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
    return f(uri, 'POST', params)
  },
}