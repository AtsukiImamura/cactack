// import Vue from "vue";
import Router from "vue-router";
import { Vue } from "vue-property-decorator";
import App from "@/view/App.vue";
import AppMenu from "@/view/common/AppMenu.vue";
import DependencyInjectionConfig from "@/config/DependencyInjectionConfig";

DependencyInjectionConfig.run();

Vue.use(Router);

const router = new Router({
  routes: [{ path: "/", component: App }]
});

new Vue({
  components: { AppMenu },
  router: router
}).$mount("#app");
