import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import HelloWorld from '@/pages/HelloWorld'
import DataView from '@/pages/DataOperations'
import FileOperations from '@/pages/FileOperations'
import Documentation from '@/pages/Documentation'
import About from '@/pages/About'

// tailwindcss config
import '@/main.css'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HelloWorld, props: { appVersion: process.env.HD_APP_VERSION } },
    { path: '/data-operations', component: DataView },
    { path: '/file-operations', component: FileOperations },
    { path: '/documentation', component: Documentation },
    { path: '/about', component: About, props: { appVersion: process.env.HD_APP_VERSION } },
    { path: '*', redirect: '/'}
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
