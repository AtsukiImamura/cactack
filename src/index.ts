// import Vue from "vue";
import "reflect-metadata";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import App from "@/view/top/App.vue";
import Flow from "@/view/flow/Flow.vue";
import RegsiterMenu from "@/view/register/RegsiterMenu.vue";
import Purchase from "@/view/register/Purchase.vue";
import AppMenu from "@/view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";
import RegisterResults from "@/view/register/RegisterResults.vue";
import Debt from "@/view/register/Debt.vue";
import Receivable from "@/view/register/Receivable.vue";
import UserRegistration from "@/view/auth/UserRegistration.vue";
import UserLogin from "@/view/auth/UserLogin.vue";
import RegisterManually from "@/view/register/RegisterManually.vue";

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", component: App },
    { path: "/flow", component: Flow },
    { path: "/inventory", component: App },
    { path: "/badget", component: App },
    { path: "/register", component: RegsiterMenu },
    { path: "/register/purchase", component: Purchase },
    { path: "/register/debt", component: Debt },
    { path: "/register/receivable", component: Receivable },
    { path: "/register/ok", component: RegisterResults },
    { path: "/register/manually", component: RegisterManually },
    { path: "/auth/create", component: UserRegistration },
    { path: "/auth/login", component: UserLogin }
  ]
});

new Vue({
  components: { AppMenu },
  router: router
}).$mount("#app");
