import VPage from './page/VPage.vue';
import { setApi } from './page/api';
import { setConfig } from './page/config/index.js';
// import elui from './elui';


// 组件列表
const vpageComponents = { Page: VPage };

// 定义 install 方法, 接收 Vue 作为参数. 如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options = {}) {

  // element-ui 组件注册
  // elui.install(Vue)

  // 外部配置
  setConfig(options.config);

  // 设置api
  setApi(options.api)

  // 组件前缀
  const prefix = options.prefix || 'V';
  Object.entries(vpageComponents).forEach(([name, component]) => {
    Vue.component(prefix + name, component)
  });
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  // 手动安装
  window.$VPage = install;
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...vpageComponents
}