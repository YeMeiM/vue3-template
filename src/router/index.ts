import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {getAutoRoutes} from "./auto"

const routes: Array<RouteRecordRaw> = [
  ...getAutoRoutes(),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
