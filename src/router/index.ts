import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {getAutoRoutes} from "./auto"
import store from "@/store";

// 路由地址配置
const routes: Array<RouteRecordRaw> = [
  ...getAutoRoutes(),
]

// 创建路由并保存路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由拦截忽略
const ignore = ["/", "/login/*"];

/**
 * 检测是否需要被忽略
 * @param path 路径
 */
function isIgnore(path: string): boolean {
  for (const p of ignore) {
    if (p.endsWith("/*") && path.startsWith(p.substring(0, p.length - 2))) {
      return true;
    } else if (p === path) {
      return true;
    }
  }
  return false;
}

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 如果不开启路由收尾、已经登录或者是忽略的路由，则直接进入
  if (process.env.VUE_APP_ROUTER_GUARD !== "true" || store.state.token || isIgnore(to.path)) {
    to.meta.needLogin = false;
    next();
  } else {
    to.meta.needLogin = true;
    if (window.android) {
      next();
    } else {
      next("/login")
    }
  }
})

export default router
