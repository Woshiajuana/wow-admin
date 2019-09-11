
import Vue from 'vue'

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import _ from 'lodash'

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

Vue.prototype.http$ = Http;

const DEFAULT_OPTIONS = {
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extend: {
        a: 1,
    },
    // API配置
    api: {
        a: 1,
    },
};

window.wowRuntime = {
    options: {},
    use (key, value) {
        value && (Vue.prototype[`$${key}`] = value);
        return this;
    },
    init (options = {}) {
        let {
            extend,
            api,
        } = _.merge({}, DEFAULT_OPTIONS, options);
        this._handleExtend(extend);
        new Vue({
            store,
            router,
            render: h => h(App),
        }).$mount('#app');
        return Vue;
    },
    getOptions () {
        return this.options;
    },
    getDefaultOptions () {
        return DEFAULT_OPTIONS;
    },
    _handleExtend () {

    },
};


window.wowRuntime.init({
    extend: {
        b: 2,
        c: 3,
    },
    api: {
        a: 2,
        c: 4,
    }
});
