import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import HelloWorld from './pages/HelloWorld'
import DataView from './pages/DataView'

// tailwindcss config
import '@/main.css'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/data-view', component: DataView },
    // { path: '/viewer', redirect: 'https://narrationsd.com' }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
