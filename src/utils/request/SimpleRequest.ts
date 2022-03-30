import axios, {AxiosError, AxiosResponse, Method} from 'axios';

const qs = require("qs")

/**
 * 请求默认配置项
 */
export interface SimpleRequestRequireConfig {
  /**
   * 请求地址
   */
  url: string;
  /**
   * 请求方式
   */
  method: Method;
  /**
   * 请求头
   */
  headers?: { [name: string]: string };
  /**
   * 请求数据
   */
  data?: any;
  /**
   * 是否是params方式请求，即将参数以字符串形式拼接在url后面
   */
  isParams: boolean;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 是否需要提示
   */
  tips: boolean;
  /**
   * 是否需要loading，默认需要
   */
  loading: boolean;
  /**
   * 是否是formData格式的
   */
  isFormData: boolean;
}

/**
 * 请求时配置项
 */
export type SimpleRequestConfig = {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 请求方式
   */
  method?: Method;
  /**
   * 请求头
   */
  headers?: { [name: string]: string };
  /**
   * 请求数据
   */
  data?: any;
  /**
   * 是否是params方式请求，即将参数以字符串形式拼接在url后面
   */
  isParams?: boolean;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 是否需要提示
   */
  tips?: boolean;
  /**
   * 是否需要loading，默认需要
   */
  loading?: boolean;
  /**
   * 是否是formData格式的
   */
  isFormData?: boolean;
  [propsName: string]: any,
}

/**
 * 请求对象初始化参数
 */
export interface SimpleRequestInitConfig<T = any> {
  /**
   * 是否是params
   */
  isParams?: boolean;
  /**
   * 基本请求地址
   */
  baseUrl?: string;
  /**
   * 默认超时事件
   */
  timeout?: number;
  /**
   * 请求前事件
   * @param opt 请求配置信息
   */
  beforeRequest?: (opt: SimpleRequestMore<T>) => SimpleRequestMore<T>;
  /**
   * 请求信息处理事件
   * @param opt 请求处理
   */
  beforeInitRequest?: (opt: SimpleRequestMore<T> | string) => SimpleRequestMore<T> | string;
  /**
   * loading盒子
   */
  loadingBox?: {
    /**
     * 显示loading
     */
    show: () => void;
    /**
     * 隐藏loading
     */
    hide: () => void;
  };
  /**
   * 错误提示
   * @param msg 错误信息
   */
  errorTips?: (msg: string) => void;
  /**
   * 请求结束后处理，如果返回的结果与预期不符，可以throw错误信息否则会将return返回的数据递交给请求成功回调
   * @param response 请求返回值
   * @param opt 请求配置项
   */
  afterRequestHandler?: (response: AxiosResponse, opt: SimpleRequestMore<T>) => any;
  /**
   * 默认的请求方式
   */
  method?: Method;
  /**
   * 默认是否使用FormData请求
   */
  isFormData?: boolean;
}

/**
 * 默认配置项
 */
export const simpleRequestInitDefaultConfig = {
  timeout: 100000,
  isFormData: true,
  method: "GET",
  enc: true,
}

type SimpleRequestMore<T> = SimpleRequestConfig & T;

/**
 * 简单的请求对象
 */
export class SimpleRequest<T = { [name: string]: any }> {

  /**
   * 请求初始化的配置项
   */
  private config: SimpleRequestInitConfig & typeof simpleRequestInitDefaultConfig;


  /**
   * 请求对象构造方法
   * @param opts 请求默认配置项
   */
  constructor(opts: SimpleRequestInitConfig<T>) {
    this.config = Object.assign({}, opts, simpleRequestInitDefaultConfig)
  }

  /**
   * 请求
   * @param cfg
   */
  request(cfg: string | SimpleRequestMore<T> = "/"): Promise<any> {
    return new Promise((resolve, reject) => {
      // 设置默认请求配置
      if(this.config.beforeInitRequest){
        cfg = this.config.beforeInitRequest(cfg);
      }
      const opt = this._setDefRequestConfig(cfg);
      // 如果传入了loadingBox，这里展示loading
      if (opt.loading && this.config.loadingBox) {
        this.config.loadingBox.show();
      }
      // 发送请求
      axios.request({
        url: opt.url,
        method: opt.method,
        headers: {
          ...opt.headers,
        },
        timeout: opt.timeout,
        [opt.isParams ? 'params' : 'data']: opt.data,
      }).then((response) => {
        if (opt.loading && this.config.loadingBox) {
          this.config.loadingBox.hide();
        }
        // 请求成功处理
        this._onRequestSuccess(response, opt, resolve, reject)
      }).catch((error) => {
        if (opt.loading && this.config.loadingBox) {
          this.config.loadingBox.hide();
        }
        // 请求失败处理
        this._onRequestError(error, opt, resolve, reject);
      })
    })
  }

  /**
   * 设置默认请求配置项
   * @param opt 请求配置项
   */
  private _setDefRequestConfig(opt: SimpleRequestMore<T> | string): SimpleRequestRequireConfig {

    // 如果是字符串，表示时=是地址，放进对象里，方便下面使用
    if (typeof opt === "string") {
      opt = {url: opt} as SimpleRequestMore<T>
    }

    // 没有设置method属性，设置为GET请求
    if (!opt.method) {
      opt.method = this.config.method;
    }

    // method是get请求，设置isParams为true，表示将数据拼接到url好了
    if (/^get$/i.test(opt.method) && typeof opt.data === "object") {
      opt.isParams = true;
    }

    /**
     * 如果未设置loading，或者loading不是布尔值
     */
    if (typeof opt.loading !== "boolean") {
      // 设置loading为：如果loading是undefined则设置为true，否则设置为布尔值
      opt.loading = opt.loading === undefined || Boolean(opt.loading);
    }

    // 如果没有设置超时时间，使用全局配置的超时时间
    if (typeof opt.timeout !== "number") {
      opt.timeout = this.config.timeout;
    }

    // 如果不是POST请求或者设置了formData
    if (opt.isParams || !/^post$/i.test(opt.method)) {
      // 不用formData
      opt.isFormData = false;

    }
    // 如果传入的值不是布尔值
    else {
      // 如果未设置是否使用formData格式则设置为预设值，否则设置为布尔值
      if (typeof opt.isFormData !== "boolean") {
        opt.isFormData = opt.isFormData === undefined ? this.config.isFormData : Boolean(opt.isFormData);
      }
    }

    // 如果需要使用formData格式，并且数据为对象，并且数据不是FormData格式
    if (opt.isFormData) {
      // 文件类型
      if (opt.data instanceof File) {
        const formData = new FormData();
        formData.append("data", opt.data)
        opt.data = formData;
      }
      // 对象，但不是formData
      else if (typeof opt.data === "object" && !SimpleRequest.isFormData(opt.data)) {
        // 将数据设置为FormData格式
        opt.headers = opt.headers ?? {};
        opt.headers["Content-Type"] = "application/x-www-form-urlencoded";
        opt.data = qs.stringify(opt.data);
      }
    }

    // 如果不是一个正常的链接，并且设置了基本请求地址
    if (!/^https?::\/\//.test(opt.url) && this.config.baseUrl) {
      opt.url = opt.url ? this.config.baseUrl + opt.url : this.config.baseUrl;
    } else if (!opt.url) {
      opt.url = "/";
    }

    opt.tips = opt.tips ?? typeof this.config.errorTips === "function"

    // 如果设置了请求前处理事件，在这里进行设置
    opt = typeof this.config.beforeRequest === "function" ? this.config.beforeRequest(opt) : opt;

    return opt as SimpleRequestRequireConfig;
  }

  /**
   * 返回对象是否是formData格式
   * @param data 对象
   * @returns 对象是否是formData格式
   */
  static isFormData(data: unknown): data is FormData {
    return data instanceof FormData;
  }

  /**
   * 当请求出错时的处理函数
   * @param error 请求错误对象
   * @param opt 请求配置
   * @param resolve 成功回调
   * @param reject 失败回调
   */
  private _onRequestError(error: AxiosError, opt: SimpleRequestConfig, resolve: (data: any) => void, reject: (data: any) => void) {
    if (!error.response) {
      // 没有返回值，表示是请求失败
      console.error("error -> 网络请求失败，请检查请求地址或请求参数信息");
      reject(error)
    } else if (error.response.status !== 200) {
      // 有返回值，且请求失败
      let message;
      switch (error.response.status) {
        case 400:
          message = '请求错误';
          break
        case 401:
          message = '未授权，请登录';
          break
        case 403:
          message = '拒绝访问';
          break
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break
        case 408:
          message = '请求超时';
          break
        case 500:
          message = '服务器内部错误';
          break
        case 501:
          message = '服务未实现';
          break
        case 502:
          message = '网关错误';
          break
        case 503:
          message = '服务不可用';
          break
        case 504:
          message = '网关超时';
          break
        case 505:
          message = 'HTTP版本不受支持';
          break
        // case "ECONNABORTED":
        //   message = '请求超时';
        //   break
        case 631:
          message = error.response!.data;
          console.log(631)
          break;
        default:
          message = "意外错误"
          break
      }
      console.error("error ->", message)
      error.message = message;
      this._onErrorTips(error.message, opt.tips)
      reject(error)
    } else {
      // 有返回值，请求成功，但接口返回失败
      reject(error)
    }
  }

  /**
   * 请求成功处理
   * @param response 请求成功返回值
   * @param opt 请求配置项
   * @param resolve 成功回调
   * @param reject 失败回调
   */
  private _onRequestSuccess(response: AxiosResponse, opt: SimpleRequestConfig, resolve: (data: any) => void, reject: (data: any) => void) {
    // 如果传入了请求结束后处理事件
    if (typeof this.config.afterRequestHandler === "function") {
      try {
        // 将处理后返回的数据返回给成功的回调
        const result = this.config.afterRequestHandler(response, opt);
        // 处理一下异步
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          resolve(result)
        }
      } catch (e) {
        // 将失败抛出的错误发送回去
        reject(e);
      }
    } else {
      resolve(response.data.data || response.data);
    }
  }

  _onErrorTips(message: string, show = true) {
    if (show && typeof this.config.errorTips === "function") {
      this.config.errorTips(message)
    }
  }

  /**
   * 将数据对象转为FormData
   * @param data 数据对象
   * @param formData formData，如果传入了，则使用此formData
   * @param namespace 命名空间，将拼接在formData键前方，正常使用无需传递
   * @returns FormData
   */
  static toFormData(data: { [prop: string]: any }, formData = new FormData(), namespace?: string): FormData {
    // 循环所有属性
    for (const k in data) {
      // 放入formData的key
      const key = namespace ? `${namespace}[${k}]` : k;
      const item = data[k];
      // 如果是对象
      if (typeof item === "object") {
        // 文件对象
        if (item instanceof File) {
          // 直接放入
          formData.append(key, item);
          // 如果是个日期对象
        } else if (item instanceof Date) {
          // 将其格式化为 2021-09-28 10:00:00 的格式
          formData.append(key, item.format("yyyy-MM-dd HH:mm:ss"))
          // 如果是数组或对象
        } else {
          // 重新执行一下
          SimpleRequest.toFormData(item, formData, key)
        }
      } else if (item !== undefined) {
        // 基本类型直接放入
        formData.append(key, item)
      }
    }

    return formData;
  }
}