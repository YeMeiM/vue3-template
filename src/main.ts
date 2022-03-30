import "./utils/common"
import "./plugins/flexible"
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import Vant from "vant"
import {install as directiveInstall} from "@/utils/directive"
import {_uu} from "@/utils/func"

export const app = createApp(App)
app.config.globalProperties.$uu = _uu;
app.use(store).use(router).use(directiveInstall).use(Vant).mount('#app')
