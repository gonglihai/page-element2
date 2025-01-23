import Vue from 'vue'
import App from './App.vue'


import VPage from '../lib/VPage.umd.min.js'
// import '../lib/VPage.css'

// import Page from '../packages'

// import api from "./api";

Vue.use(VPage, {
  prefix: 'C',
  config: {
    leftTreeWidth: '200px',
    treeExpandLevel: 2,
  },
  // api: api
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
