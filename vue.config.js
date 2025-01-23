// 文档：https://cli.vuejs.org/zh/config/#vue-config-js

module.exports = {
  publicPath: './',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
    port: 3001
  },
  // 内联css
  css: {
    extract: false
  },
}
