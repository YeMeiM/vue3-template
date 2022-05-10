import { SimpleEventHandler } from "@/utils/event";
import useClipboard from 'vue-clipboard3'
import { Dialog } from "vant/lib/dialog"
import { getCurrentInstance } from "vue";
import { simpleRequest } from "@/utils/request"
import * as verification from "@/utils/common/verification";

export class SimpleUtils extends SimpleEventHandler {

  constructor() {
    super();
  }

  static init<T>(plugin: T): SimpleUtils & T {
    const util = (new SimpleUtils() as SimpleUtils & T);
    for (const k in plugin) {
      (util as any)[k] = plugin[k];
    }
    return util;
  }

  /**
   * 单次定时器，对setTimeout的异步封装，好处是可以使用await，但缺点很明显：耗费性能且一旦开始就没有办法停止
   * @param timeout 定时时间
   */
  sleep(timeout = 700): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  /**
   * 将px转换为rem，其实只是将其除以基准值37.5
   * @param num 对应像素
   */
  rem(num: number): string {
    return `${Number((num / 37.5).toFixed(5))}rem`;
  }

  /**
   * 获取element的当前样式
   * @param el dom
   * @param name 样式值
   */
  style(el: Element, name: keyof CSSStyleDeclaration): string {
    return getComputedStyle(el, null)[name] as string;
  }

  private static html2canvas: any = null;

  /**
   * 将dom转换为base64格式的图像资源
   * @param el 需要被转换的元素
   * @param ignoreElements 此方法会分别传入不同的元素，如果返回true，那么该元素将被忽略
   */
  toImage(el: HTMLElement, ignoreElements?: (el: HTMLElement) => boolean): Promise<string> {
    if (!SimpleUtils.html2canvas) SimpleUtils.html2canvas = require("html2canvas");
    return new Promise(resolve => SimpleUtils.html2canvas(el, {
      allowTaint: true,
      useCORS: true,
      ignoreElements,
      logging: process.env.NODE_ENV === "development",
    }).then((canvas: HTMLCanvasElement) => resolve(canvas.toDataURL("image/png"))))
  }

  /**
   * 确认框
   * @param opt
   */
  confirm(opt: {
    title?: string;
    message?: string | (() => JSX.Element),
    confirmButton?: string | boolean;
    cancelButton?: string | boolean;
    closeOnClickOverlay?: boolean;
  }) {
    return Dialog({
      title: opt.title,
      message: opt.message,
      confirmButtonText: opt.confirmButton === true ? "确定" : opt.confirmButton || "",
      cancelButtonText: opt.cancelButton === true ? "取消" : opt.cancelButton || "",
      showConfirmButton: Boolean(opt.confirmButton),
      showCancelButton: Boolean(opt.cancelButton),
      className: "simple-dialog",
      confirmButtonColor: "#2878ff",
      cancelButtonColor: "#666666",
      closeOnClickOverlay: opt.closeOnClickOverlay,
    })
  }

  private static clipboard: any = null;

  /**
   * 复制文本
   * @param text
   */
  copyText(text: string): Promise<void> {
    if (!text) {
      return Promise.reject(new Error("被复制的文字不得为空"))
    }
    if (!SimpleUtils.clipboard) {
      SimpleUtils.clipboard = useClipboard();
    }
    return SimpleUtils.clipboard.toClipboard(text)
  }

  private static UU_STORE_NAME = "UU_STORE"

  /**
   * 保存数据到本地存储中
   * @param name 储存时的名字
   * @param value 储蓄的值
   */
  saveBox(name: string, value: any): void {
    localStorage.setItem(`${SimpleUtils.UU_STORE_NAME}_${name}`, JSON.stringify({ data: value, }))
  }

  /**
   * 取出储存的值，如果没有，则返回null
   * @param name 储存时的名字
   * @returns 储存的值
   */
  getBox(name: string): any {
    const value = localStorage.getItem(`${SimpleUtils.UU_STORE_NAME}_${name}`);
    if (!value) {
      return null;
    }
    return JSON.parse(value).data;
  }

  /**
   * 删除储存的值
   * @param name 储存时的名字
   */
  removeBox(name: string): void {
    localStorage.removeItem(`${SimpleUtils.UU_STORE_NAME}_${name}`)
  }
}

// /**
//  * 上传一群文件
//  * @param fileList 文件列表
//  * @returns 上传后的文件地址列表
//  */
// export async function uploadFileList(fileList: Array<File>): Promise<string[]> {
//   const formData = new FormData();
//   for (const i in fileList) formData.append(`data${i}`, fileList[i]);
//   const res = await simpleRequest.request({
//     url: "/upload",
//     method: "POST",
//     isFormData: true,
//     data: formData,
//     isModule: true,
//     enc: process.env.VUE_APP_ENC === "true",
//   })
//   return Object.keys(res).map(k => (res as any)[k]);
// }

/**
 * 上传一群文件
 * @param file 文件列表
 * @returns 文件地址列表
 */
export function uploadFile(file: Array<File>): Promise<string[]>;

/**
 * 上传一个文件
 * @param file 文件
 * @returns 文件地址
 */
export function uploadFile(file: File): Promise<string>;

/**
 * 上传一个或一群文件
 * @param file 文件或文件列表
 * @returns 如果是文件，则返回文件地址，如果是文件列表，则返回文件地址列表
 */
export async function uploadFile(file: File | Array<File>): Promise<string | string[]> {
  const formData = new FormData();
  if (file instanceof File) {
    formData.append("data", file);
  } else {
    for (const i in file) formData.append(`data${i}`, file[i]);
  }
  const res = await simpleRequest.request({
    url: "/upload",
    method: "POST",
    isFormData: true,
    data: formData,
    isModule: true,
    enc: process.env.VUE_APP_ENC === "true",
  })

  if (file instanceof File) {
    return res.data;
  } else {
    return Object.keys(res).map(k => (res as any)[k]);
  }
}

export const _uu = SimpleUtils.init({
  /**
   * 请求
   */
  req: simpleRequest.request.bind(simpleRequest),
  /**
   * 上传文件或文件列表
   */
  upload: uploadFile,
  /**
   * 校验
   */
  ver: verification,
});

export function useUU(): SimpleUtils {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error("未找到应用实例，可能不是在setup内调用？")
  }
  return instance.appContext.config.globalProperties.$uu;
}