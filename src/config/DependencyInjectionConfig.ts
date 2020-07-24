import "reflect-metadata";
import { container } from "tsyringe";
import StabJournalRepository from "@/repository/stab/StabJournalRepository";
import StabUserRepository from "@/repository/stab/StabUserRepository";
import config from "config";
import * as firebase from "firebase/app";
import "firebase/firestore";
/**
 * DI管理用クラス
 */
export default class DependencyInjectionConfig {
  /**
   * 本番用DIを登録する
   */
  public static runWeb(): void {
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyAzW1labZ1ykRxMOahBv3Z4Jil8wsbqIyc",
        // authDomain: "### FIREBASE AUTH DOMAIN ###",
        projectId: "cactack-26e4c",
      });
    } catch (e) {
      console.error("Error on init firebase");
    }
  }

  /**
   * テスト用のDIを登録する
   */
  public static runLocal(): void {
    container.register("JournalRepository", {
      useClass: StabJournalRepository,
    });
    container.register("UserRepository", {
      useClass: StabUserRepository,
    });
  }

  public static run() {
    if (config.TARGET === "web") {
      DependencyInjectionConfig.runWeb();
      return;
    }
    DependencyInjectionConfig.runLocal();
  }
}
