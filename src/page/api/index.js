import defaultApi from "./fetchApi";

let request = defaultApi;

/**
 * Page.vue相关Api
 * @author GongLiHai
 */
export default {
  /**
   * get 方法
   * @param {String} uri    后端地址
   * @param {Object} params 请求参数
   * @returns Promise 下拉框数据
   */
  get(uri, params) {
    return request.get(uri, params);
  },
  /**
   * post 请求
   * @param {String} uri   删除api
   * @param {Object} params 请求参数
   * @returns Promise 删除结果
   */
  post(uri, params) {
    return request.post(uri, params);
  },
  /**
   * 删除方法
   * @param {String} uri   删除api
   * @param {Object} params 请求参数
   * @returns Promise 删除结果
   */
  delete(uri, params) {
    return request.delete(uri, params);
  },
};

/**
 * 设置 api
 * @param {Object} api 
 */
export function setApi(api) {
  if (!api) {
    return;
  }
  request = api;
}