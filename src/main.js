import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import HelloWorld from '@/pages/HelloWorld'
import DataOperatitons from '@/pages/DataOperations'
import DataConflict from '@/pages/DataConflict'
import FileOperations from '@/pages/FileOperations'
import MasterDetail from '@/pages/MasterDetail'
import InterAction from '@/pages/InterAction'
import Documentation from '@/pages/Documentation'
import About from '@/pages/About'

// tailwindcss config
import '@/main.css'
import HardocsDb from '@/pages/HardocsDb';

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HelloWorld, props: { appVersion: process.env.HD_APP_VERSION } },
    { path: '/data-operations', component: DataOperatitons },
    { path: '/file-operations', component: FileOperations },
    { path: '/master-detail', component: MasterDetail },
    { path: '/hardocs-db', component: HardocsDb },
    { path: '/inter-action', component: InterAction },
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
