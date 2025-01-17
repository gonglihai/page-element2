function f(url, method, params) {
  return new Promise((resolve, reason) => {

    const options = {
      headers: {
        method,
      },
    };

    if (method != 'GET') {
      options.headers["Content-Type"] = "application/json";
    }

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