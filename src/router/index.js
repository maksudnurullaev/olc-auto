import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/HelloWorld.vue"
import Tutorial from "../views/Tutorial.vue"
import SplitPanes from "../views/SplitPanes.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/tut",
    name: "Tutorial",
    component: Tutorial,
  },
  {
    path: "/splitpanes",
    name: "Splitpanes",
    component: SplitPanes,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;