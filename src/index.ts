import "reflect-metadata";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import AppMenu from "./view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import "intro.js/introjs.css";
import VueIntro from "vue-introjs";
import { VueMasonryPlugin } from "vue-masonry";
import VuePaginate from "vue-paginate";
import routes from "./routes";

Vue.use(VuePaginate as any);
Vue.use(VueMasonryPlugin as any);
Vue.use(VueIntro as any); // TODO: typeほしい。。。

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: routes,
});
router.beforeEach((to, from, next) => {
  // if (from.path.startsWith("/load") && to.path.startsWith("/load")) {
  //   return;
  // }
  // if (from.path.startsWith("/load") || to.path.startsWith("/load")) {
  //   next();
  //   return;
  // }
  if (
    !to.path.startsWith("/auth") &&
    !to.path.startsWith("/top") &&
    !to.path.startsWith("/user") &&
    !container.resolve(UserAuthService).getFirebaseUser()
  ) {
    next("/auth/login");
    return;
  }
  // next(`/load?to=${to.path}`);
  next();
});

new Vue({
  components: { AppMenu },
  router: router,
}).$mount("#app");
