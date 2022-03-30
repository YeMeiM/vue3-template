import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {getAutoRoutes} from "./auto"
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  ...getAutoRoutes(),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === "/" || to.path.startsWith("/login") || store.state.user) {
    next();
  } else {
    next({
      path: "/login",
      replace: true,
    })
  }
})

export default router
