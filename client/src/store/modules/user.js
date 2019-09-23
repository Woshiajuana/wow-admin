import { resetRouter } from '@/router'
import Vue from 'vue'
import storage from '@utils/storage'

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
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('SET_USER_INFO', '');
            Vue.$router.push(`/login?redirect=${Vue.$route.fullPath}`)
            resolve();
        })
    },

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

