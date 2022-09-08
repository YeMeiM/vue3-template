import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { getAutoRoutes } from "./auto"
import store from "@/store";

// 路由地址配置
const routes: Array<RouteRecordRaw> = [
  ...getAutoRoutes(),
]

// 创建路由并保存路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0, behavior: "auto" }
    }
  }
})

// 路由拦截忽略
const ignore = ["/login/*"];

/**
 * 检测是否需要被忽略
 * @param path 路径
 */
function isIgnore(path: string): boolean {
  if (process.env.VUE_APP_ROUTER_INTERCEPTOR !== "true") {
    return true;
  }
  for (const p of ignore) {
    // 匹配路径
    if (p === path) {
      return true;
    }
    // 匹配路径前缀
    if (p.endsWith("/*")) {
      const p2 = (p.substring(0, p.length - 2));
      if (p2 === path || path.startsWith(p2)) {
        return true;
      }
    }
  }
  return false;
}

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 如果不开启路由收尾、已经登录或者是忽略的路由，则直接进入
  if (store.state.token || isIgnore(to.path)) {
    next();
  } else {
    next({
      path: "/login",
    })
  }
})

export default router
