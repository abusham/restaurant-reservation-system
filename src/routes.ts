import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Reservations from "./pages/reservations.vue";
import NotFound from "./pages/not-found.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Reservations },
  { path: "/:path(.*)", component: NotFound, meta: { title: "Not found" } },
];

// Initialize the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
