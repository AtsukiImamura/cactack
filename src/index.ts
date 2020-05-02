import "reflect-metadata";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import AppMenu from "@/view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import "intro.js/introjs.css";
import VueIntro from "vue-introjs";
Vue.use(VueIntro as any); // TODO: typeほしい。。。

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "app" */ "@/view/top/App.vue"),
    },
    {
      path: "/flow",
      component: () =>
        import(/* webpackChunkName: "flow" */ "@/view/flow/Flow.vue"),
    },
    {
      path: "/inventory",
      component: () =>
        import(/* webpackChunkName: "app" */ "@/view/top/App.vue"),
    },
    {
      path: "/register",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/RegisterMenu.vue"
        ),
    },
    {
      path: "/register/purchase",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Purchase.vue"
        ),
    },
    {
      path: "/register/debt",
      component: () =>
        import(/* webpackChunkName: "register" */ "@/view/register/Debt.vue"),
    },
    {
      path: "/register/receivable",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Receivable.vue"
        ),
    },
    {
      path: "/register/ok",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/RegisterResults.vue"
        ),
    },
    {
      path: "/register/manually",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Manually.vue"
        ),
    },
    {
      path: "/transaction/:transactionId/:method",
      component: () =>
        import(/* webpackChunkName: "top" */ "@/view/register/Manually.vue"),
    },
    {
      path: "/auth/create",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/UserRegistration.vue"
        ),
    },
    {
      path: "/user/create/begin",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationTop.vue"
        ),
    },
    {
      path: "/user/create/cash",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationCash.vue"
        ),
    },
    {
      path: "/user/create/balance",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationBalance.vue"
        ),
    },
    {
      path: "/user/create/credit-mapping",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationCreditMapping.vue"
        ),
    },
    {
      path: "/user/create/property-selection",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationPropertySelection.vue"
        ),
    },
    {
      path: "/user/create/property",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationProperty.vue"
        ),
    },
    {
      path: "/user/create/in-and-out",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationSteadyInOut.vue"
        ),
    },
    {
      path: "/user/create/finish",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationFinish.vue"
        ),
    },
    {
      path: "/auth/login",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/view/auth/UserLogin.vue"),
    },
    {
      path: "/top",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/view/Landing.vue"),
    },
    {
      path: "/badget",
      component: () =>
        import(/* webpackChunkName: "badget" */ "@/view/badget/Badget.vue"),
    },
    {
      path: "/badget/detail",
      component: () =>
        import(
          /* webpackChunkName: "badget" */ "@/view/badget/BadgetDetail.vue"
        ),
    },
    // {
    //   path: "/user/init",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "badget" */ "@/view/auth/Initialization.vue"
    //     ),
    // },
  ],
});
router.beforeEach((to, from, next) => {
  if (
    // !to.path.startsWith("/user") && // TODO: 本番でははずす
    !to.path.startsWith("/auth") &&
    !to.path.startsWith("/top") &&
    !to.path.startsWith("/user") &&
    !container.resolve(UserAuthService).userId
  ) {
    next("/auth/login");
    return;
  }
  next();
});

new Vue({
  components: { AppMenu },
  router: router,
}).$mount("#app");
