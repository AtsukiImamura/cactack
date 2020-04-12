import "reflect-metadata";
import { container } from "tsyringe";
import StabJournalRepository from "../repository/stab/StabJournalRepository";
import StabJournalDetailRepository from "../repository/stab/StabJournalDetailRepository";
import StabPropertyRepository from "../repository/stab/StabPropertyRepository";
import StabBadgetRepository from "../repository/stab/StabBadgetRepository";
import StabDepreciationRepository from "../repository/stab/StabDepreciationRepository";
import StabUserRepository from "../repository/stab/StabUserRepository";
import StabBadgetGroupRepository from "../repository/stab/StabBadgetGroupRepository";
import config from "config";

import JournalRepository from "@/repository/JournalRepository";
import PropertyRepository from "@/repository/PropertyRepository";
import BadgetRepository from "@/repository/BadgetRepository";
import BadgetGroupRepository from "@/repository/BadgetGroupRepository";
import DepreciationRepository from "@/repository/DepreciationRepository";
// import JournalDetailRepository from "@/repository/_JournalDetailRepository";
import UserRepository from "@/repository/UserRepository";

import * as firebase from "firebase/app";
import "firebase/firestore";
import TransactionRepository from "@/repository/TransactionRepository";
/**
 * DI管理用クラス
 */
export default class DependencyInjectionConfig {
  /**
   * 本番用DIを登録する
   */
  public static runWeb(): void {
    container.register("JournalRepository", {
      useClass: JournalRepository
    });
    container.register("PropertyRepository", {
      useClass: PropertyRepository
    });
    container.register("BadgetRepository", {
      useClass: BadgetRepository
    });
    container.register("BadgetGroupRepository", {
      useClass: BadgetGroupRepository
    });
    container.register("DepreciationRepository", {
      useClass: DepreciationRepository
    });
    // container.register("JournalDetailRepository", {
    //   useClass: JournalDetailRepository,
    // });
    container.register("UserRepository", {
      useClass: UserRepository
    });
    container.register("TransactionRepository", {
      useClass: TransactionRepository
    });

    try {
      firebase.initializeApp({
        apiKey: "AIzaSyAzW1labZ1ykRxMOahBv3Z4Jil8wsbqIyc",
        // authDomain: "### FIREBASE AUTH DOMAIN ###",
        projectId: "cactack-26e4c"
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
      useClass: StabJournalRepository
    });
    container.register("PropertyRepository", {
      useClass: StabPropertyRepository
    });
    container.register("BadgetRepository", {
      useClass: StabBadgetRepository
    });
    container.register("BadgetGroupRepository", {
      useClass: StabBadgetGroupRepository
    });
    container.register("DepreciationRepository", {
      useClass: StabDepreciationRepository
    });
    container.register("JournalDetailRepository", {
      useClass: StabJournalDetailRepository
    });
    container.register("UserRepository", {
      useClass: StabUserRepository
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
