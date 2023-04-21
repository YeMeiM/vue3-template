import {isRef, reactive, ref, Ref} from "vue";

export interface LoadListForm {
  lastId: number;
  page: number;
}

export interface LoadListDataType<L = any> {
  lastId: number;
  currentPage: number;
  lastPage: number;
  list: L[],
}

export interface LBox {
  /**
   * 列表请求中
   */
  loading: boolean;
  /**
   * 列表全部请求结束
   */
  finished: boolean;
  /**
   * 列表请求错误
   */
  error: boolean;
}

export interface LoadListOption<T, L = any> {
  /**
   * 用户提交的表单数据
   */
  form: T;
  /**
   * 列表请求状态
   */
  lBox: Partial<LBox>;
  /**
   * 列表数据
   */
  list: L[] | Ref<L[]>;
  /**
   * 是否需要打印数据
   */
  print: boolean | string;
  /**
   * 当请求响应后
   * @param res 响应后的数据
   */
  afterResponse: (res: Expand<LoadListDataType<L>>) => void;
  /**
   * 当重置请求之前
   * @param form
   */
  beforeRefresh: (form: T & LoadListForm) => void;
  /**
   * 处理函数
   */
  handler: LoadHandler<T, L>
}

export type LoadHandler<T, L> = (form: T & LoadListForm) => Promise<LoadListDataType<L> | L[]>;

function getLBox(lBox?: Partial<LBox>): LBox {
  if (!lBox) {
    return reactive({loading: false, finished: false, error: false,})
  }
  lBox.finished === undefined && (lBox.finished = false);
  lBox.loading === undefined && (lBox.loading = false);
  lBox.error === undefined && (lBox.error = false);

  return lBox as LBox;
}

function getForm<T>(form?: T): T & LoadListForm {
  if (!form) {
    return {lastId: 0, page: 1} as any;
  } else {
    if ((form as any).lastId === undefined) {
      (form as any).lastId = 0;
    }
    if ((form as any).page === undefined) {
      (form as any).page = 1;
    }
    return (form as any);
  }
}

function getOpt<T, L>(opt: LoadHandler<T, L> | (Must<Partial<LoadListOption<T, L>>, "handler">)): LoadListOption<T & LoadListForm, L> & {
  list: Ref<L[]>
} {
  const result: any = typeof opt === "function" ? {handler: opt} : opt;
  result.lBox = getLBox(result.lBox);
  result.form = getForm(result.form);
  result.list = (result.list ? isRef(result.list) ? result.list : ref(result.list) : ref([]));
  return result;
}

/**
 * 一个简单的列表请求方法
 * @param options
 */
export function onLoadList<T = {}, L = any>(options: LoadHandler<T, L> | (Must<Partial<LoadListOption<T, L>>, "handler">)) {
  const opt = getOpt(options)
  const response = ref({}) as Ref<LoadListDataType<L>>;

  const onRequestSuccess = (res: LoadListDataType<L> | L[]) => {
    if (Array.isArray(res)) res = {lastId: 0, currentPage: 1, lastPage: 1, list: res};
    opt.print && console.log(typeof opt.print === "string" ? `${opt.print} ->` : 'list ->', res);
    opt.afterResponse && opt.afterResponse(res);
    response.value = res;
    opt.form.lastId = res.lastId;
    opt.form.page++;
    opt.list.value = opt.list.value.concat(res.list);
    opt.lBox.loading = false;
    if (res.currentPage === undefined ||
        res.lastPage === undefined ||
        res.currentPage >= res.lastPage) {
      opt.lBox.finished = true;
    }
  }

  const onRequestFail = () => {
    opt.lBox.error = true;
  }

  const onLoad = () => {
    opt.handler(opt.form).then(onRequestSuccess).catch(onRequestFail)
  }

  const onRefresh = () => {
    opt.list.value = [];
    opt.form.lastId = 0;
    opt.form.page = 1;
    opt.lBox.finished = false;
    opt.lBox.loading = true;
    if (opt.beforeRefresh) {
      opt.beforeRefresh(opt.form);
    }
    onLoad();
  }

  return {
    /**
     * 控制加载状态的盒子
     */
    lBox: opt.lBox,
    /**
     * 用来提交的表单
     */
    form: opt.form,
    /**
     * 存储数据的列表
     */
    list: opt.list,
    /**
     * 调用此方法，加载一次列表
     */
    onLoad,
    /**
     * 调用此方法，重置页数后加载一次列表
     */
    onRefresh,
    /**
     * 请求响应后的数据
     */
    response,
  }
}
