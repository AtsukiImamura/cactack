import { VuexModule, getModule, Module } from "vuex-module-decorators";
import store from ".";

@Module({ dynamic: true, store, name: "control", namespaced: true })
class TransactionStore extends VuexModule {}

const TransactionModule = getModule(TransactionStore);
export default TransactionModule;
