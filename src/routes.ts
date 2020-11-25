export default [
  /** ------------------------------- ランディングページ -------------------------------------- */

  {
    path: "/top",
    component: () =>
      import(/* webpackChunkName: "auth" */ "./view/Landing.vue"),
  },

  /** ------------------------------- ユーザー登録 -------------------------------------- */

  {
    path: "/auth/create",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/UserRegistration.vue"
      ),
  },
  {
    path: "/user/create/begin",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationTop.vue"
      ),
  },
  {
    path: "/user/create/email-verification",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationWaitingEmailVerification.vue"
      ),
  },
  {
    path: "/auth/email-verification",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/EmailVerificationProceeding.vue"
      ),
  },
  {
    path: "/user/create/cash",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationCash.vue"
      ),
  },
  {
    path: "/user/create/balance",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationBalance.vue"
      ),
  },
  {
    path: "/user/create/credit-mapping",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationCreditMapping.vue"
      ),
  },
  // {
  //   path: "/user/create/property-selection",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationPropertySelection.vue"
  //     ),
  // },
  // {
  //   path: "/user/create/property",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationProperty.vue"
  //     ),
  // },
  // {
  //   path: "/user/create/in-and-out",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationSteadyInOut.vue"
  //     ),
  // },
  {
    path: "/user/create/finish",
    component: () =>
      import(
        /* webpackChunkName: "creation" */ "./view/auth/creation/UserCreationFinish.vue"
      ),
  },

  /** ------------------------------- アプリ -------------------------------------- */

  {
    path: "/init",
    component: () =>
      import(/* webpackChunkName: "app" */ "./view/top/InitApp.vue"),
  },
  {
    path: "/",
    component: () => import(/* webpackChunkName: "app" */ "./view/top/App.vue"),
  },
  {
    path: "/journal",
    component: () =>
      import(/* webpackChunkName: "journal" */ "./view/journal/Journals.vue"),
  },
  {
    path: "/journalize",
    component: () =>
      import(
        /* webpackChunkName: "journal" */ "./view/register/RegisterMenu.vue"
      ),
  },

  {
    path: "/journalize/c/:journalId",
    component: () =>
      import(
        /* webpackChunkName: "journal" */ "./view/register/CopyRedirect.vue"
      ),
  },
  {
    path: "/journalize/transfer",
    component: () =>
      import(/* webpackChunkName: "journal" */ "./view/register/Manually.vue"),
  },
  {
    path: "/journalize/transfer/:templateId",
    component: () =>
      import(/* webpackChunkName: "journal" */ "./view/register/Manually.vue"),
  },
  {
    path: "/journalize/edit/:journalId",
    component: () =>
      import(/* webpackChunkName: "journal" */ "./view/register/Manually.vue"),
  },
  {
    path: "/journalize/copy/:journalId",
    component: () =>
      import(/* webpackChunkName: "journal" */ "./view/register/Manually.vue"),
  },
  {
    path: "/ledger/general",
    component: () =>
      import(
        /* webpackChunkName: "ledger" */ "./view/ledger/GeneralLedger.vue"
      ),
  },
  {
    path: "/ledger/general/:type",
    component: () =>
      import(
        /* webpackChunkName: "ledger" */ "./view/ledger/GeneralLedger.vue"
      ),
  },
  {
    path: "/ledger/detail/:categoryItemId",
    component: () =>
      import(/* webpackChunkName: "ledger" */ "./view/ledger/LedgerDetail.vue"),
  },
  {
    path: "/auth/login",
    component: () =>
      import(/* webpackChunkName: "auth" */ "./view/auth/UserLogin.vue"),
  },
  {
    path: "/auth/login/auto",
    component: () =>
      import(/* webpackChunkName: "auth" */ "./view/auth/UserLogin.vue"),
  },
  {
    path: "/category/list",
    component: () =>
      import(
        /* webpackChunkName: "category" */ "./view/category/CategoryList.vue"
      ),
  },
  {
    path: "/balance",
    component: () =>
      import(
        /* webpackChunkName: "balance" */ "./view/balance/BalanceView.vue"
      ),
  },

  {
    path: "/balance/correction",
    component: () =>
      import(
        /* webpackChunkName: "balance" */ "./view/balance/BalanceCorrection.vue"
      ),
  },
  {
    path: "/notice",
    component: () =>
      import(/* webpackChunkName: "config" */ "./view/notice/Notices.vue"),
  },
  {
    path: "/config",
    component: () =>
      import(/* webpackChunkName: "config" */ "./view/config/DateConfigs.vue"),
  },
  {
    path: "/config/date",
    component: () =>
      import(/* webpackChunkName: "config" */ "./view/config/DateConfigs.vue"),
  },
  {
    path: "/config/version",
    component: () =>
      import(/* webpackChunkName: "config" */ "./view/config/VersionInfo.vue"),
  },
  {
    path: "/load",
    component: () => import(/* webpackChunkName: "config" */ "./view/Load.vue"),
  },

  // {
  //   path: "/auth/attempt-to-login",
  //   component: () =>
  //     import(/* webpackChunkName: "badget" */ "./view/AttemptToLogin.vue"),
  // },

  {
    path: "/badget",
    component: () =>
      import(/* webpackChunkName: "badget" */ "./view/badget/BadgetList.vue"),
  },
  {
    path: "/badget/create",
    component: () =>
      import(/* webpackChunkName: "badget" */ "./view/badget/BadgetEditor.vue"),
  },
  {
    path: "/badget/detail/:badgetId",
    component: () =>
      import(/* webpackChunkName: "badget" */ "./view/badget/BadgetDetail.vue"),
  },
  {
    path: "/badget/edit/:badgetId",
    component: () =>
      import(/* webpackChunkName: "badget" */ "./view/badget/BadgetEditor.vue"),
  },
];
