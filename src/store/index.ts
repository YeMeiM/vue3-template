import { i18n } from '@/i18n';
import { createStore } from 'vuex'

export const USER_TOKEn_NAME = "USER_TOKEN";
export const USER_LANGUAGE_NAME = "USER_LANGUAGE";

const store = createStore({
  state: {
    /**
     * 用户Token
     */
    token: "",
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
      if (process.env.VUE_APP_TOKEN_LOCAL_SAVE !== "true") {
        return
      }
      if (token) {
        localStorage.setItem(USER_TOKEn_NAME, token)
      } else {
        localStorage.removeItem(USER_TOKEn_NAME);
      }
    },
    /**
     * 设置用户语言
     * @param state store.state
     * @param language 语言
     */
    SET_USER_LANGUAGE(state, language?: string) {
      // 如果传入的语言为空，则设置为默认语言
      state.language = language ?? "zh";
      // 设置i18n
      i18n.global.locale = state.language;
      // 储存上次选择的语言
      localStorage.setItem(USER_LANGUAGE_NAME, state.language);
    },
  },
  actions: {},
  modules: {}
})

if (process.env.VUE_APP_TOKEN_LOCAL_SAVE === "true") {
  store.commit("SET_USER_TOKEN", localStorage.getItem(USER_TOKEn_NAME) || "");
}



export default store;
