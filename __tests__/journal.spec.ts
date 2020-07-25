import "reflect-metadata";
import { container } from "tsyringe";
import UserAuthService from "../src/service/UserAuthService";
import DependencyInjectionConfig from "../src/config/DependencyInjectionConfig";
import Journal from "../src/model/Journal";
import AppModule from "../src/store/ApplicationStore";
import CategoryList from "../src/model/category/CategoryList";
import JournalDetail from "../src/model/JournalDetail";
import JournalRepository from "../src/repository/JournalRepository";
import { IUserCategoryItem } from "../src/model/interface/ICategory";

import * as firebase from "firebase/app";
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

describe("journal insertion", () => {
  let jnlId: string = "";
  test("insertion", () => {
    return (async () => {
      const categories = AppModule.categories as CategoryList;

      expect(categories.getAll().length > 0).toBe(true);

      const item = categories.getAllItems()[0] as IUserCategoryItem;
      if (!item) {
        return;
      }
      const journal = Journal.simple(
        "test1",
        [new JournalDetail(item, 1800)],
        [new JournalDetail(item, 1800)]
      );
      const inserted = await container
        .resolve(JournalRepository)
        .insert(journal);

      expect(inserted.id).not.toBe("");
      expect(inserted.userId).not.toBe("");

      jnlId = inserted.id;
    })();
  });

  test("journal aquireing from firestore", () => {
    return (async () => {
      const bJnlDoc = await firebase
        .firestore()
        .collection("journals")
        .doc(jnlId)
        .get();

      expect(bJnlDoc.exists).toBe(true);

      if (!bJnlDoc.exists) {
        return;
      }

      const bJnl = bJnlDoc.data();

      if (!bJnl) {
        return;
      }

      bJnl.id = bJnlDoc.id;

      expect(bJnl.debits.length).toBe(1);
      expect(bJnl.credits.length).toBe(1);
      expect(bJnl.title).toBe("test1");
    })();
  });
});
