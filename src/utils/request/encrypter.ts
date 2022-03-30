import CryptoJs from "crypto-js";

const jsMd5 = require('js-md5');
const base64 = require('js-base64')

export interface EncParamsInterface {
  iv: CryptoJs.lib.WordArray,
  mode: typeof CryptoJs.mode.CBC,
  padding: typeof CryptoJs.pad.Pkcs7
}

export interface EncDataParamsInterface {
  /**
   * 
   */
  iv: string,
  /**
   * 加密验证的mac码
   */
  mac: string,
  /**
   * 加密的数据
   */
  value: string,
}

/**
 * 一个简单的加密器
 */
export class SimpleEnCryptor {
  private readonly aesKey;
  private readonly appKey;

  /**
   * 加密
   * @param aesKey 用于加密解密的Key，一般是后台生成
   * @param appKey 用于生成签名的Key，一般也是后台生成
   */
  constructor(aesKey: string, appKey?: string) {
    this.aesKey = base64.decode(aesKey.substr(8, aesKey.length - 16));
    this.appKey = appKey;
  }

  /**
   * 将对象加密转码为字符串
   * @param data 需要转码加密的对象
   */
  aesEncrypt(data: unknown): string {
    const key = CryptoJs.enc.Utf8.parse(this.aesKey);
    const iv = SimpleEnCryptor.randomBytes();
    const param: EncParamsInterface = {
      iv: iv,
      mode: CryptoJs.mode.CBC,
      padding: CryptoJs.pad.Pkcs7
    };
    const plaintext = JSON.stringify(data);
    const ciphertext = CryptoJs.AES.encrypt(plaintext, key, param).toString();
    const ivStr = CryptoJs.enc.Base64.stringify(iv);
    const mac = this.hash(ivStr, ciphertext);
    const json = JSON.stringify({
      iv: ivStr,
      mac: mac,
      value: ciphertext
    });
    return CryptoJs.enc.Base64.stringify(CryptoJs.enc.Utf8.parse(json));
  }

  /**
   * 将转码后的字符串解码为原来的对象
   * @param tempData 加密转码后的字符串数据
   */
  aesDecrypt(tempData: string): any {
    const payload = this.getJsonPayload(tempData);
    const key = CryptoJs.enc.Utf8.parse(this.aesKey);
    const iv = CryptoJs.enc.Base64.parse(payload.iv);
    const param = {
      iv: iv,
      mode: CryptoJs.mode.CBC,
      padding: CryptoJs.pad.Pkcs7
    };
    const plaintext = CryptoJs.AES.decrypt(
      payload.value,
      key,
      param
    );
    return JSON.parse(plaintext.toString(CryptoJs.enc.Utf8));
  }

  /**
   * 如果设置了AppKey，则向原数据中添加签名，如果需要加密则返回加密后的数据，否则返回原数据。
   * @param info 进行签名的原数据
   * @param data 数据对象内附的数据，无论任何情况都会尝试将此数据放入info内的data属性上
   * @param enc 是否需要加密
   */
  getInfoData(info: any, data?: any, enc = true): any {
    if (!this.appKey) {
      info.data = data;
      return info;
    }
    info.sign = SimpleEnCryptor.sign(info, this.appKey);
    info.data = data;
    return enc ? { encryptedData: this.aesEncrypt(info) } : info;
  }

  /**
   * 为请求数据生成签名
   * @param data 不包含data的请求数据
   * @param appKey 用于生成签名的AppKey
   */
  static sign(data: any, appKey: string): string {
    // 参数排序
    data = SimpleEnCryptor.sortObj(data)
    // 临时字符串
    const tempString = SimpleEnCryptor.serializeObject(data)
    // 加密
    return jsMd5(base64.encode(`${appKey}${tempString}${appKey}`)).toLowerCase();
  }

  /**
   * 将传入的对象内的属性按照ASCII码进行升序排序
   * @param data 请求数据
   */
  private static sortObj(data: any) {
    const keysArr = Object.keys(data).sort();
    const sortObj: { [name: string]: any } = {};
    for (const i in keysArr) {
      sortObj[keysArr[i]] = data[keysArr[i]];
    }
    return sortObj;
  }

  /**
   * 将传入的对象以【key】=【value】&【key】=【value】的形式拼接为字符串
   * @param data
   * @private
   */
  private static serializeObject(data: any) {
    const str = [];
    for (const k in data) {
      if (Object.hasOwnProperty.call(data, k)) {
        str.push(k + "=" + encodeURIComponent(data[k]));
      }
    }
    return str.join("&");
  }


  /**
   * SHA256哈希运算
   * @param str1 信息
   * @param str2 信息
   */
  private hash(str1: string, str2: string): string {
    return CryptoJs.HmacSHA256(str1 + str2, this.aesKey).toString();
  }

  /**
   * 验证数据格式
   * @param box 需要被验证的对象
   */
  private static validPayload(box: any): box is EncDataParamsInterface {
    return (typeof box === "object" &&
      "iv" in box &&
      "mac" in box &&
      "value" in box &&
      CryptoJs.enc.Base64.parse(box.iv).sigBytes === 16);
  }

  /**
   * 获取随机数
   */
  private static random(): string {
    return Math.random().toString(36).substr(2);
  }

  /**
   * 获取随机字节数组
   */
  private static randomBytes(): CryptoJs.lib.WordArray {
    return CryptoJs.enc.Utf8.parse(
      CryptoJs.MD5(SimpleEnCryptor.random()).toString().substr(9, 16)
    );
  }

  /**
   * 计算Mac参数
   * @param tempData 负载数据对象
   * @param key SHA256的Key
   */
  private calculateMac(
    tempData: { iv: string; value: string; mac: string },
    key: CryptoJs.lib.WordArray
  ): CryptoJs.lib.WordArray {
    return CryptoJs.HmacSHA256(
      this.hash(tempData.iv, tempData.value),
      key
    );
  }

  /**
   * 两个数据的HASH值是否一致
   * @param data1 数据1
   * @param data2 数据2
   */
  private static hashEquals(data1: CryptoJs.lib.WordArray, data2: CryptoJs.lib.WordArray): boolean {
    const uscStr = data1.toString();
    const dlrStr = data2.toString();
    const len = uscStr.length;
    let result = 0;
    for (let i = 0; i < len; ++i) {
      result |=
        uscStr.charCodeAt(i) ^ dlrStr.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * 验证Mac值
   * @param tempData
   */
  private validMac(tempData: EncDataParamsInterface) {
    const bytes = SimpleEnCryptor.randomBytes();
    const calculated = this.calculateMac(tempData, bytes);
    return SimpleEnCryptor.hashEquals(CryptoJs.HmacSHA256(tempData.mac, bytes), calculated);
  }

  /**
   * 获取加密后字符串内的负载数据
   * @param tempData 加密转码后的字符串数据
   */
  private getJsonPayload(tempData: string): EncDataParamsInterface {
    tempData = CryptoJs.enc.Base64.parse(tempData).toString(CryptoJs.enc.Utf8);
    const resultData = JSON.parse(tempData);
    if (!SimpleEnCryptor.validPayload(resultData)) {
      throw new window.Error("The payload is invalid.");
    }
    if (!this.validMac(resultData)) {
      throw new window.Error("The MAC is invalid.");
    }
    return resultData;
  }

}