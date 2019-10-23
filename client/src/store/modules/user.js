
import Vue from 'vue'
import storage from '@utils/storage'
import generateRouter, { resetRouter } from '@router'

const router = generateRouter();

const state = {
    objUserInfo: '',
};

const mutations = {
    SET_USER_INFO: (state, objUserInfo) => {
        state.objUserInfo = Object.assign({}, objUserInfo);
        storage.local.set('USER_INFO', objUserInfo);
    },
};

const actions = {

    // 登录
    login({ commit }, data) {
        return new Promise((resolve, reject) => {
            let { $curl, $appConst } = Vue.prototype;
            $curl($appConst.DO_USER_LOGIN, data).then((objUserInfo) => {
                commit('SET_USER_INFO', objUserInfo);
                resolve(objUserInfo);
            }).catch((err) => {
                reject(err);
            });
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            let objUserInfo = storage.local.get('USER_INFO');
            if (objUserInfo) {
                commit('SET_USER_INFO', objUserInfo);
            }
            resolve(objUserInfo);
        })
    },

    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            let { $curl, $appConst, $storage } = Vue.prototype;
            const { access_token = '' } = $storage.local.get('USER_INFO') || {};
            (() => {
                return access_token ? $curl($appConst.DO_USER_LOGOUT) : Promise.resolve();
            })().then(() => {}).toast().finally(() => {
                commit('SET_USER_INFO', '');
                resetRouter();
                dispatch('tagsView/delAllCachedViews', {}, { root: true });
                dispatch('tagsView/delAllVisitedViews', {}, { root: true });
                router.push(`/login`);
                resolve();
            });
        })
    },

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

