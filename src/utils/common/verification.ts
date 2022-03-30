const emailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const phoneReg = /^[1][0-9]{10}$/;
const pass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
const pay = /^\d{6}$/;
const captcha = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6}$/;
const account = /^[a-zA-Z][a-zA-Z0-9_-]{2,16}$/i;
const color16 = /^#([\da-f]{3}|[\da-f]{6})$/i;
const colorRgb = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,(\d(\.\d*)?))?\)$/i;

/**
 * 是否是密码
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isPass(value: string): boolean {
  return pass.test(value);
}
/**
 * 是否是安全密码
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isPay(value: string): boolean {
  return pay.test(value)
}
/**
 * 是否是邮箱
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isEmail(value: string): boolean {
  return emailReg.test(value)
}
/**
 * 是否是手机号
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isPhone(value: string): boolean {
  return phoneReg.test(value)
}
/**
 * 是否是验证码
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isCaptcha(value: string): boolean {
  return captcha.test(value);
}
/**
 * 是否是账号
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isAccount(value: string): boolean {
  return account.test(value)
}

/**
 * 是否是16进制颜色值
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function is16ColorText(value: string): boolean {
  return color16.test(value);
}

/**
 * 是否是rgb颜色值
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isRgbColorText(value: string): boolean {
  return colorRgb.test(value);
}

/**
 * 是否是颜色值
 * @param value 被校验的值
 * @returns 是否通过校验
 */
function isColorText(value: string): boolean {
  return is16ColorText(value) || isRgbColorText(value)
}

export {
  isPass,
  isPay,
  isEmail,
  isPhone,
  isCaptcha,
  isAccount,
  isColorText,
  is16ColorText,
  isRgbColorText
}