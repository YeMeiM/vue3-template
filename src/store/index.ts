import { createStore } from 'vuex'

export const USER_TOKEn_NAME = "USER_TOKEN";

const store = createStore({
  state: {
    /**
     * 用户Token
     */
    token: "",
    /**
     * 版本号
     */
    version: "1.0.0",
  },
  mutations: {
    /**
     * 设置app版本号
     */
    SET_APP_VERSION(state, version: string) {
      state.version = version;
    },
    /**
     * 设置用户token，如果传入空，则删除token
     * @param state store.state
    * @param token 用户Token
     */
    SET_USER_TOKEN(state, token?: string) {
      // state.user = !user || user.startsWith("Bearer") ? user ?? "" : `Bearer ${user}`;
      state.token = token ?? "";
      if (process.env.VUE_APP_TOKEN_LOCAL_SAVE !== "true") return;
      if (token) localStorage.setItem(USER_TOKEn_NAME, token)
      else localStorage.removeItem(USER_TOKEn_NAME)
    },
  },
  actions: {},
  modules: {}
})

if (process.env.VUE_APP_TOKEN_LOCAL_SAVE === "true") {
  store.commit("SET_USER_TOKEN", localStorage.getItem(USER_TOKEn_NAME) || "");
}

export default store;
