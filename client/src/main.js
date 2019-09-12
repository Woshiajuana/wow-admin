
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

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

const DEFAULT_OPTIONS = {
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extendUtils: {

    },
    // API配置
    httpRequest: {
        baseURL: '',
        timeout: 3000,
        method: 'POST',
        callbackSuccess: response => response,
        callbackError: () => {},
    },
    // app 常量配置
    appConst: {
        REQ_APP_INFO: '',
    },
};

window.wowRuntime = {
    app: null, // app
    wow: {}, // 总体工具类
    options: {},
    init (options = {}) {
        this.options = _.merge({}, DEFAULT_OPTIONS, options);
        this._handleInitExtend();
        this._handleInitHttp();
        this._handleInitConst();
        this._handleInitApp();
        this._handleMountVue();
        window.wow = this.wow;
        return { app: this.app, wow: this.wow};
    },
    getOptions () {
        return this.options;
    },
    getDefaultOptions () {
        return DEFAULT_OPTIONS;
    },
    _handleMountVue () {
        Object.assign(Vue.prototype, this.wow);
        return this;
    },
    _handleInitApp () {
        this.app = new Vue({
            store,
            router,
            render: h => h(App),
        }).$mount('#app');
        return this;
    },
    _handleInitConst () {
        let { appConst } = this.options;
        this.wow.$appConst = appConst;
        return this;
    },
    _handleInitHttp () {
        let { httpRequest } = this.options;
        this.wow.$curl = Http(httpRequest);
        return this;
    },
    _handleInitExtend () {
        let { extendUtils } = this.options;
        _.forEach(extendUtils, (item, key) => this._use(key, item));
        return this;
    },
    _use (key, value) {
        value && (this.wow[`$${key}`] = value);
        return this;
    },
};


let { wow, app } = window.wowRuntime.init({
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extendUtils: {
        ccc: () => { console.log('cacaca') },
    },
    // API配置
    httpRequest: {
        baseURL: 'http://192.168.2.160:7001/',
        timeout: 3000,
    },
    // app 常量配置
    appConst: {
        REQ_APP_INFO: 'api/v1/app/info',
    },
    // 路由配置
    routerConfig: {

    },
    // 组件配置
    component: {

    },
});

console.log(wow);
