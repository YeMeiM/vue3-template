import {SimpleRequest} from "./SimpleRequest"
import {App} from "vue";
import {SimpleEnCryptor} from "./encrypter"
import router from "@/router";
import store from "@/store";
import {Toast} from "vant";
import {_uu} from "@/utils/func";

interface SimpleRequestEnc {
  module: string;
  interface: string | number;
  enc: boolean;
  sign: boolean;
  isModule: boolean;
}

const simpleEnc = new SimpleEnCryptor(process.env.VUE_APP_ENC_AES_KEY, process.env.VUE_APP_ENC_APP_KEY);

export const simpleRequest = new SimpleRequest<Partial<SimpleRequestEnc>>({
  baseUrl: process.env.VUE_APP_REQUEST_PROXY ? process.env.VUE_APP_REQUEST_PROXY : process.env.VUE_APP_REQUEST_URL,
  timeout: 10000,
  method: "POST",
  isFormData: false,
  errorTips: Toast,
  loadingBox: {
    show() {
      _uu.$emit("update:loading", true);
    },
    hide() {
      _uu.$emit("update:loading", false);
    }
  },
  beforeInitRequest(opt) {
    if (typeof opt === "object") {
      if (opt.module && opt.interface) {
        opt.isModule = true;
        !opt.url && (opt.url = "/portal");
        opt.method = "post";
        opt.isFormData = false;
        opt.enc === undefined && (opt.enc = process.env.VUE_APP_ENC === "true");
        opt.data = simpleEnc.getInfoData({
          source: 'web', version: 'v1', module: opt.module,
          interface: opt.interface, timestamp: Math.round(new Date().getTime() / 1000)
        }, opt.data, opt.enc);
      }
      if (opt.isModule) {
        !opt.headers && (opt.headers = {});
        store.state.token && (opt.headers['Authorization'] = store.state.token);
      }
    }
    return opt;
  },
  afterRequestHandler(res, opt) {
    if (opt.isModule) {
      const data = opt.enc ? simpleEnc.aesDecrypt(res.data.encryptedData) : res.data;
      switch (data.code) {
        case 0:
          return data.data ?? data;
        case 4700:
          store.commit("removeUser");
          router.replace("/login");
          simpleRequest._onErrorTips("登陆信息已过期,请重新登陆", opt.tips)
          throw data;
        case 4800:
        case 4810:
        case 4500:
        case 4900:
          console.log("error -> ", data)
          simpleRequest._onErrorTips(data.message, opt.tips)
          throw data;
        default:
          console.log("error -> ", data)
          simpleRequest._onErrorTips("网络异常，请稍后..", opt.tips);
          throw data;
      }
    }
    return res.data;
  }
});

export function install(app: App) {
  app.config.globalProperties.$req = simpleRequest.request.bind(simpleRequest);
}