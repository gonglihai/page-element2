import VPage from './page/VPage.vue';
import { setApi } from './page/api';
import { setConfig } from './page/config/index.js';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

// 组件列表
const components = { Page: VPage };

// 定义 install 方法, 接收 Vue 作为参数. 如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options = {}) {

  // 外部配置
  setConfig(options.config);
  // 设置api
  setApi(options.api)

  // element-ui
  Vue.use(ElementUI);

  // 遍历注册全局组件
  // 指定组件前缀
  const prefix = options.prefix || 'V';
  for (const [defaultName, component] of Object.entries(components)) {
    const name = prefix + defaultName
    console.log('[VPage] 组件注册 name:', name, 'component:', component);
    Vue.component(name, component)
  }
}


// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  // 手动安装
  window.__pageElement2 = install;
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...components
}