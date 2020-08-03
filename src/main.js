import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import HelloWorld from '@/pages/HelloWorld'
import DataOperatitons from '@/pages/DataOperations'
import DataConflict from '@/pages/DataConflict'
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
    { path: '/data-operations', component: DataOperatitons },
    { path: '/file-operations', component: FileOperations },
    { path: '/data-conflict', component: DataConflict },
    { path: '/documentation', component: Documentation },
    { path: '/about', component: About, props: { appVersion: process.env.HD_APP_VERSION } },
    { path: '*', redirect: '/'}
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
