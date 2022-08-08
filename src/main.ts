import "@/plugins/babelPolyfill"
import "./utils/common"
import "./plugins/flexible"
import 'vant/lib/index.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from "vant"
import { install as directiveInstall } from "@/utils/directive"
import { _uu } from "@/utils/func"
import { i18n } from "./i18n";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $uu: typeof _uu,
    $store: typeof store,
  }
}

export const app = createApp(App)
app.config.globalProperties.$uu = _uu;
app.use(i18n).use(store).use(router).use(directiveInstall).use(Vant).mount('#app')
