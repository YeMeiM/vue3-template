// 动态css
const styleEl = document.createElement("style");
styleEl.type = "text/css"
document.head.appendChild(styleEl);

const varBox = new Map<string, string>();

/**
 * 设置全局变量
 * @param name 变量名
 * @param value 变量值，如果变量为数字，则会拼接上px，字符串不作处理，数组会使用【,】拼接
 */
export function setVar(name: string, value: number | string | string[]) {
  if (typeof value === "number") {
    value = `${value}px`;
  } else {
    if (Array.isArray(value)) {
      value = value.join(",");
    }
    if (value.includes(";")) {
      throw new Error(`变量【${name}】设置失败，意外的符号【;】`)
    }
  }

  varBox.set(name, value);
  let text = ":root{";
  varBox.forEach((val, key) => {
    text = `${text}\n--${key}:${val};`
  })
  text = `${text}\n}`
  styleEl.innerText = text;
}