
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
import '@utils/promise'

import http from '@utils/http'
import modal from '@utils/modal'
import storage from '@utils/storage'
import verify from '@utils/verify'

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

const componentFiles = require.context('./components', true, /index\.vue$/); // 不支持变量传路径

componentFiles.keys().forEach((key) => {
    let strName = key.substring(2, key.indexOf('/index.vue'));
    Vue.component(strName, componentFiles(key).default || componentFiles(key));
});


const DEFAULT_OPTIONS = {
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extendUtils: {
        modal,
        storage,
        verify,
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
        // 查询 APPINFO
        REQ_APP_INFO: 'api/v1/app/info',
        // 设置 APPINFO
        DO_APP_INIT: 'api/v1/app/init',
        // 管理员用户登录
        DO_USER_LOGIN: 'api/v1/user-info/login',

        // 查询管理员用户列表
        REQ_USER_LIST: 'api/v1/user-info/list',
        // 创建管理员用户
        DO_CREATE_USER_INFO: 'api/v1/user-info/create',
        // 编辑管理员用户
        DO_UPDATE_USER_INFO: 'api/v1/user-info/update',
        // 删除管理员用户
        DO_DELETE_USER_INFO: 'api/v1/user-info/delete',

        // 查询管理元用户组列表
        REQ_USER_GROUP_LIST: 'api/v1/user-group/list',
        // 创建用户组
        DO_CREATE_USER_GROUP: 'api/v1/user-group/create',
        // 编辑用户组
        DO_UPDATE_USER_GROUP: 'api/v1/user-group/update',
        // 删除用户组
        DO_DELETE_USER_GROUP: 'api/v1/user-group/delete',
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
        this._handleMountVue();
        this._handleInitApp();
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
        this.wow.$curl = http(httpRequest);
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
        ccc1: () => { console.log('cacaca') },
        ccc: () => { console.log('cacaca') },
    },
    // API配置
    httpRequest: {
        baseURL: 'http://127.0.0.1:7001/',
        timeout: 3000,
    },
    // app 常量配置
    appConst: {

    },
    // 路由配置
    routerConfig: {

    },
    // 组件配置
    component: {

    },
});

console.log(wow);
