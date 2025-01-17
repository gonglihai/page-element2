import Vue from 'vue'
import App from './App.vue'

import Page from '../packages'

Vue.use(Page, {
  prefix: 'C'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
