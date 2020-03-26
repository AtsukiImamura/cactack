// import Vue from "vue";
import "reflect-metadata";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import App from "@/view/top/App.vue";
import Flow from "@/view/flow/Flow.vue";
import RegsiterMenu from "@/view/register/RegsiterMenu.vue";
import RegisterPurchase from "@/view/register/RegisterPurchase.vue";
import AppMenu from "@/view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", component: App },
    { path: "/flow", component: Flow },
    { path: "/inventory", component: App },
    { path: "/badget", component: App },
    { path: "/register", component: RegsiterMenu },
    { path: "/register/purchase", component: RegisterPurchase }
  ]
});

new Vue({
  components: { AppMenu },
  router: router
}).$mount("#app");
