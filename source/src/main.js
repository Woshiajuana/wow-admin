import Vue from 'vue'

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/assets/scss/index.scss' // global css
import '@/assets/icons' // icon
import '@/permission' // permission control

import App from './App.vue'
import store from './store'
import router from './router'

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
