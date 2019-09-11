
import Vue from 'vue'

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import App from '@/App.vue'
import store from '@store'
import router from '@router'

import '@assets/scss/index.scss'
import '@assets/icons' // icon

import Http from '@utils/http.util'


Http(Http.API.REQ_APP_INFO).then((res) => {
    console.log('成功回调 => ', res);
}).catch((err) => {
    console.log('失败回调 => ', err);
});


Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');


Vue.prototype.http$ = Http;

const DEFAULT_OPTIONS = {
    // http 配置
    httpConfig: {

    },
};

window.wowRuntime = {
    init (options = {}) {
        let {
            httpConfig,

        } = options;
    },
    getDefaultOptions () {
        return DEFAULT_OPTIONS;
    },
};


