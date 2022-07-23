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

  type Expand<T, V = any, K extends string = string> = T & { [name in K]: V };

  type Must<T, L extends keyof T> = T & { [P in L]: T[P] };
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
    return format.replace(/(y{4})|(y{2})|(M{2})|(d{2})|(h{2})|(H{2})|(m{2})|(S{3})|(s{2})/g, (key) => {
      switch (key) {
        case "yyyy":
          return this.getFullYear().toString();
        case "yy":
          return this.getFullYear().toString().substring(2);
        case "MM":
          return (this.getMonth() + 1).toString().padStart(2, "0");
        case "dd":
          return this.getDate().toString().padStart(2, "0");
        case "hh":
          return this.getHours().toString().padStart(2, "0");
        case "HH": {
          const h = this.getHours();
          return (h > 12 ? 12 - h : h).toString().padStart(2, "0");
        }
        case "mm":
          return this.getMinutes().toString().padStart(2, "0");
        case "ss":
          return this.getSeconds().toString().padStart(2, "0");
        case "SS":
          return this.getMilliseconds().toString().padStart(3, "0");
        default:
          return key;
      }
    })
  }
  return this.toLocaleString();
}



export { }