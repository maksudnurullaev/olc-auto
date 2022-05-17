import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue"
import Help from "../views/Help.vue"
import Kpp from "../views/Kpp.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
  {
    path: "/kpp",
    name: "Kpp",
    component: Kpp,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;