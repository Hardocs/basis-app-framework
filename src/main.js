import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import HelloWorld from './pages/HelloWorld'
import DataView from './pages/DataOperations'
import FileOperations from './pages/FileOperations'

// tailwindcss config
import '@/main.css'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/data-operations', component: DataView },
    { path: '/file-operations', component: FileOperations },
    { path: '*', redirect: '/'}
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
