import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import HelloWorld from './pages/HelloWorld'
import DataView from './pages/DataView'
import ButtonsGurka from './pages/ButtonsGurka'

// tailwindcss config
import '@/main.css'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: HelloWorld },
    { path: '/data-view', component: DataView },
    { path: '/buttons-gurka', component: ButtonsGurka },
    // { path: '/viewer', redirect: 'https://narrationsd.com' },
    { path: '*', redirect: '/'}
  ]
})

new Vue({
  router,
  render: h => h(App),
  // created() {
  //   // Prevent blank screen in Electron builds
  //   this.$router.push('/data-view')
  // }
}).$mount('#app')
