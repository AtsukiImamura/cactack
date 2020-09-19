import "reflect-metadata";
import { container } from "tsyringe";
import StabJournalRepository from "@/repository/stab/StabJournalRepository";
import StabUserRepository from "@/repository/stab/StabUserRepository";
import config from "config";
import firebase from "firebase/app";
// import "firebase/firestore";
import IJournalRepository from "@/repository/interface/IJournalRepository";
import IUserRepository from "@/repository/interface/IUserRepository";
import JournalRepository from "@/repository/JournalRepository";
import ICategoryItemMasterRepository from "@/repository/interface/ICategoryItemMasterRepository";
import CategoryItemMasterRepository from "@/repository/CategoryItemMasterRepository";
import ICategoryMasterRepository from "@/repository/interface/ICategoryMasterRepository";
import CategoryMasterRepository from "@/repository/CategoryMasterRepository";
import TemplateRepository from "@/repository/TemplateRepository";
import ITemplateRepository from "@/repository/interface/ITemplateRepository";
import IUserCreationMasterRepository from "@/repository/interface/IUserCreationMasterRepository";
import UserCreationMasterRepository from "@/repository/UserCreationMasterRepository";
import UserRepository from "@/repository/UserRepository";
import StabCategoryMasterRepository from "@/repository/stab/StabCategoryMasterRepository";
import StabTemplateRepository from "@/repository/stab/StabTemplateRepository";
import StabUserCreationMasterRepository from "@/repository/stab/StabUserCreationMasterRepository";
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
        projectId: "cactack-26e4c",
      });
    } catch (e) {
      console.error("Error on init firebase");
    }
    container.register<ICategoryItemMasterRepository>(
      "CategoryItemMasterRepository",
      {
        useClass: CategoryItemMasterRepository,
      }
    );
    container.register<ICategoryMasterRepository>("CategoryMasterRepository", {
      useClass: CategoryMasterRepository,
    });
    container.register<IJournalRepository>("JournalRepository", {
      useClass: JournalRepository,
    });
    container.register<ITemplateRepository>("TemplateRepository", {
      useClass: TemplateRepository,
    });
    container.register<IUserCreationMasterRepository>(
      "UserCreationMasterRepository",
      {
        useClass: UserCreationMasterRepository,
      }
    );
    container.register<IUserRepository>("UserRepository", {
      useClass: UserRepository,
    });
  }

  /**
   * テスト用のDIを登録する
   */
  public static runLocal(): void {
    container.register<ICategoryItemMasterRepository>(
      "CategoryItemMasterRepository",
      {
        useClass: CategoryItemMasterRepository,
      }
    );
    container.register<ICategoryMasterRepository>("CategoryMasterRepository", {
      useClass: StabCategoryMasterRepository,
    });
    container.register<IJournalRepository>("JournalRepository", {
      useClass: StabJournalRepository,
    });
    container.register<ITemplateRepository>("TemplateRepository", {
      useClass: StabTemplateRepository,
    });
    container.register<IUserCreationMasterRepository>(
      "UserCreationMasterRepository",
      {
        useClass: StabUserCreationMasterRepository,
      }
    );
    container.register<IUserRepository>("UserRepository", {
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
