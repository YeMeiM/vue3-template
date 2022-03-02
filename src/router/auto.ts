import {RouteRecordRaw} from "vue-router";

interface FileInfo {
  path: string[];
  origin: string[];
  fileName: string;
}

const files = require.context("@/views", true, /\.vue$/)

export function getFileInfo(key: string): FileInfo {
  const path = key.replace(/(\.\/)|(\.\w+$)/g, '').toLowerCase().split("/");

  return {
    path: path.slice(0, path.length),
    fileName: path[path.length - 1],
    origin: path,
  }
}

function isIgnore(key: string, ignore: string[]): boolean {
  key = key.replace(/(^\.)|(\.\w+$)/g, '');
  // 如果是_开头的文件名或目录，则忽略
  if (/(\/_)/g.test(key)) {
    return true;
  }
  // 如果是DEV文件夹，且不是开发模式，忽略
  if (/^\/DEV\//i.test(key) && process.env.NODE_ENV !== "development") {
    return true;
  }
  key = key.toLowerCase();
  return ignore.some(path => key.startsWith(path));
}

/**
 * 获取自动路由
 * @param ignore 忽略的目录，以/开头
 */
export function getAutoRoutes(ignore?: string[]): RouteRecordRaw[] {
  if (ignore) {
    ignore = ignore.map(it => it.trim().toLowerCase())
  }
  const autoRoutes: Array<RouteRecordRaw> = [];

  files.keys().forEach(key => {
    if (ignore && isIgnore(key, ignore)) {
      return;
    }
    const item = files(key);
    if (item.default.pass) {
      return;
    }
    const fileInfo = getFileInfo(key);
    const routeItem: RouteRecordRaw = {
      path: "/",
      name: "",
      component: item.default,
      children: item.default.children,
      redirect: item.default.redirect,
      meta: item.default.meta,
    }
    if (fileInfo.origin[0] !== "home" || fileInfo.origin[1] != "index") {
      fileInfo.origin.forEach(function (p, index) {
        if (index !== fileInfo.origin.length - 1 || p !== 'index') {
          routeItem.path = routeItem.path === "/" ? `/${p}` : `${routeItem.path}/${p}`;
        }
      })

      routeItem.name = routeItem.path.substring(1).replace(/\/\w/g, (e) => `${e[1].toUpperCase()}${e.substring(2)}`);
    } else {
      routeItem.name = "home";
    }

    if (item.default.urlName) {
      routeItem.path = `${routeItem.path}/:${item.default.urlName}`
    }

    autoRoutes.push(routeItem);
  })

  return autoRoutes;
}