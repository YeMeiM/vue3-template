interface Window {
  /**
   * 如果是 @黄玉如 的android套壳则存在test对象
   */
  test?: {
    /**
     * 保存base64格式图片
     * @param url 需要被保存的base64格式图片
     */
    savebase64image: (url: string) => void;
    /**
     * 保存远程地址图片
     * @param url 图片远程地址
     */
    saveimage: (url: string) => void;
    /**
     * 检查版本更新
     *
     * {
     *  "newVersion": "最新版本: 1.0.0",
     *  "VersionCode": "版本号: 100",
     *  "Version_force": "最新版本: 1.0.0",
     *  "VersionCode_force": "版本号: 100",
     *  "downurl": "下载地址：http://xxx.xxx.xx",
     *  "isUpdate": "是否需要更新：1",
     *  "forceUpdate": "是否强制更新：1",
     *  "updateDescription": "更新秒数：'修复若干bug'"
     * }
     *
     * @param json
     */
    version: (json: string) => void;
    /**
     * 分享
     * {
     *  logo: "图标",
     *  title: "标题",
     *  url: "分享链接",
     *  remark: "备注"
     * }
     */
    share: (json: string) => void;
    /**
     * 微信支付
     * {
     *  app_response: "微信返回的JSON"
     * }
     */
    wxpay: (json: string) => void;
    /**
     * 支付宝支付
     * @param json { url: "服务器返回的支付返回值" }
     * @param payment_id 标识id，可以随便传
     */
    alipay: (json: string, payment_id: string) => void;
    /**
     * 手机扫码
     */
    scan: () => void;

    [props: string]: any;
  };
  /**
   * 支付回调
   * @param status 1是成功, 0是失败
   */
  payresult?: (status: 0 | 1) => void;
  /**
   * 扫码成功回调
   * @param data 二维码的数据
   */
  scansuccess?: (data: string) => void;
  /**
   * android检查版本更新，一般来说只有使用 @黄玉如 的打包工具才有作用
   * @param versionNum 版本号: 100
   */
  changeversion?: (versionNum: number) => void;

  [props: string]: any
}