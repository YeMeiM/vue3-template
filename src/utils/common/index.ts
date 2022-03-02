declare global {
  interface Date {
    /**
     * 日期格式化
     * @param format 日期格式
     */
    format: (format: string) => string;
  }

  interface ObjectConstructor {
    /**
     * 判断对象是否是空的
     * @param obj 被判断的对象
     */
    isEmpty: (obj: any) => boolean
  }
}

Object.isEmpty = function (obj) {
  if (obj === null ||
    obj === undefined ||
    obj === "") {
    return true;
  }
  if (typeof obj === "object") {
    return ((Array.isArray(obj) && !obj.length) || !Object.keys(obj).length)
  }
  return false
}

Date.prototype.format = function (format): string {
  if (format) {
    return format.replace(/(y{2})|(y{4})|(M{2})|(d{2})|(h{2})|(H{2})|(m{2})|(s{2})|(S{3})/g, (key) => {
      switch (key) {
        case "yyyy":
          return this.getFullYear().toString();
        case "yy":
          return this.getFullYear().toString().substring(2);
        case "MM":
          return (this.getMonth() + 1).toString();
        case "dd":
          return this.getDate().toString();
        case "hh":
          return this.getHours().toString();
        case "HH": {
          const h = this.getHours();
          return (h > 12 ? 12 - h : h).toString();
        }
        case "mm":
          return this.getMinutes().toString();
        case "ss":
          return this.getSeconds().toString();
        case "SS":
          return this.getMilliseconds().toString();
        default:
          return key;
      }
    })
  }
  return this.toLocaleString();
}

export {}