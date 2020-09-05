import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import HelloWorld from '@/pages/HelloWorld'
import MasterDetail from '@/pages/MasterDetail'
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
    { path: '/master-detail', component: MasterDetail },
    { path: '/hardocs-db', component: HardocsDb },
    { path: '/documentation', component: Documentation },
    { path: '/about', component: About, props: { appVersion: process.env.HD_APP_VERSION } },
    { path: '*', redirect: '/'}
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
