import "reflect-metadata";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import AppMenu from "@/view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";
import { container } from "tsyringe";
import UserAuthService from "@/service/UserAuthService";
import "intro.js/introjs.css";
import VueIntro from "vue-introjs";
import { VueMasonryPlugin } from "vue-masonry";
import VuePaginate from "vue-paginate";

Vue.use(VuePaginate as any);
Vue.use(VueMasonryPlugin as any);
Vue.use(VueIntro as any); // TODO: typeほしい。。。

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: [
    /** ------------------------------- ランディングページ -------------------------------------- */

    {
      path: "/top",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/view/Landing.vue"),
    },

    /** ------------------------------- ユーザー登録 -------------------------------------- */

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
      path: "/user/create/email-verification",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/creation/UserCreationWaitingEmailVerification.vue"
        ),
    },
    {
      path: "/auth/email-verification",
      component: () =>
        import(
          /* webpackChunkName: "top" */ "@/view/auth/EmailVerificationProceeding.vue"
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

    /** ------------------------------- アプリ -------------------------------------- */

    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "app" */ "@/view/top/App.vue"),
    },
    // {
    //   path: "/flow",
    //   component: () =>
    //     import(/* webpackChunkName: "flow" */ "@/view/flow/Flow.vue"),
    // },
    // {
    //   path: "/inventory",
    //   component: () =>
    //     import(/* webpackChunkName: "app" */ "@/view/top/App.vue"),
    // },
    {
      path: "/journalize",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/RegisterMenu.vue"
        ),
    },
    {
      path: "/journal",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/journal/Journals.vue"
        ),
    },
    // {
    //   path: "/journalize/purchase",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "register" */ "@/view/register/Purchase.vue"
    //     ),
    // },
    // {
    //   path: "/journalize/debt",
    //   component: () =>
    //     import(/* webpackChunkName: "register" */ "@/view/register/Debt.vue"),
    // },
    // {
    //   path: "/journalize/receivable",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "register" */ "@/view/register/Receivable.vue"
    //     ),
    // },
    // {
    //   path: "/journalize/ok",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "register" */ "@/view/register/RegisterResults.vue"
    //     ),
    // },
    {
      path: "/journalize/transfer",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Manually.vue"
        ),
    },
    {
      path: "/journalize/edit/:journalId",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Manually.vue"
        ),
    },
    {
      path: "/journalize/copy/:journalId",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/register/Manually.vue"
        ),
    },
    {
      path: "/ledger/general",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/ledger/GeneralLedger.vue"
        ),
    },
    {
      path: "/ledger/detail/:categoryItemId",
      component: () =>
        import(
          /* webpackChunkName: "register" */ "@/view/ledger/LedgerDetail.vue"
        ),
    },
    {
      path: "/auth/login",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/view/auth/UserLogin.vue"),
    },
    // {
    //   path: "/badget",
    //   component: () =>
    //     import(/* webpackChunkName: "badget" */ "@/view/badget/Badget.vue"),
    // },
    // {
    //   path: "/badget/detail",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "badget" */ "@/view/badget/BadgetDetail.vue"
    //     ),
    // },
    {
      path: "/category/list",
      component: () =>
        import(
          /* webpackChunkName: "badget" */ "@/view/category/CategoryList.vue"
        ),
    },
    {
      path: "/balance",
      component: () =>
        import(
          /* webpackChunkName: "badget" */ "@/view/balance/BalanceView.vue"
        ),
    },
    {
      path: "/notice",
      component: () =>
        import(/* webpackChunkName: "badget" */ "@/view/notice/Notices.vue"),
    },
    {
      path: "/config",
      component: () =>
        import(/* webpackChunkName: "badget" */ "@/view/config/Configs.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (
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
