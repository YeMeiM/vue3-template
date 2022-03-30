import {createStore} from 'vuex'

const USER_NAME = "USER_TOKEN"

const store = createStore({
  state: {
    /**
     * 用户Token
     */
    user: "",
    /**
     * 语言
     */
    language: "zh",
    /**
     * 版本号
     */
    version: "1.0.0",
  },
  mutations: {
    /**
     * 设置用户token
     * @param state store.state
     * @param user 用户Token
     */
    setUser(state, user) {
      // state.user = !user || user.startsWith("Bearer") ? user ?? "" : `Bearer ${user}`;
      state.user = user;
      if (process.env.VUE_APP_TOKEN_LOCAL_SAVE === "true") {
        localStorage.setItem(USER_NAME, user)
      }
    },
    /**
     * 删除用户Token
     * @param state store.state
     */
    removeUser(state) {
      state.user = '';
      if (process.env.VUE_APP_TOKEN_LOCAL_SAVE === "true") {
        localStorage.removeItem(USER_NAME);
      }
    },
  },
  actions: {},
  modules: {}
})

if (process.env.VUE_APP_TOKEN_LOCAL_SAVE === "true") {
  store.commit("setUser", localStorage.getItem(USER_NAME));
}

export default store;
