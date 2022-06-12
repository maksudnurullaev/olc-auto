import { createWebHistory, createRouter } from "vue-router";

import LogInOut from "../views/LogInOut.vue"
import Kpp from "../views/Kpp.vue"

const routes = [
  {
    path: "/",
    name: "Kpp",
    component: Kpp,
  },
  {
    path: "/config",
    name: "LogInOut",
    component: LogInOut,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;