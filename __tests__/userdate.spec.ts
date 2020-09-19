import "reflect-metadata";
import { container } from "tsyringe";
import UserAuthService from "../src/service/UserAuthService";
import DependencyInjectionConfig from "../src/config/DependencyInjectionConfig";
import Journal from "../src/model/Journal";
import AppModule from "../src/store/ApplicationStore";
import CategoryList from "../src/model/category/CategoryList";
import JournalDetail from "../src/model/JournalDetail";
import IJournalRepository from "../src/repository/interface/IJournalRepository";
import { IUserCategoryItem } from "../src/model/interface/ICategory";

import firebase from "firebase/app";
import "firebase/firestore";

beforeAll(() => {
  DependencyInjectionConfig.run();
  return container
    .resolve(UserAuthService)
    .createUserIfNotExist("test@test.com", "testtest")
    .finally(() =>
      container
        .resolve(UserAuthService)
        .signIn("test@test.com", "testtest")
        .then(() => AppModule.init())
    )
    .catch((e) => {});
});

afterAll(() => {
  container.resolve(UserAuthService).signOut();
});
