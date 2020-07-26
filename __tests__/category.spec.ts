import "reflect-metadata";
import DependencyInjectionConfig from "../src/config/DependencyInjectionConfig";
import { container } from "tsyringe";
import UserAuthService from "../src/service/UserAuthService";
import AppModule from "../src/store/ApplicationStore";
import UserCategoryFlyweight from "../src/repository/flyweight/UserCategoryFlyweight";
import AccountType from "../src/model/AccountType";
import UserCategory from "../src/model/UserCategory";

import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  IUserCategory,
  IUserCategoryItem,
} from "../src/model/interface/ICategory";
import UserCategoryItemFlyweight from "../src/repository/flyweight/UserCategoryItemFlyweight";
import UserCategoryItem from "../src/model/UserCategoryItem";

// beforeAll(() => {
//   DependencyInjectionConfig.run();
//   return container
//     .resolve(UserAuthService)
//     .createUserIfNotExist("test@test.com", "testtest")
//     .finally(() =>
//       container
//         .resolve(UserAuthService)
//         .signIn("test@test.com", "testtest")
//         .then(() => AppModule.init())
//     )
//     .catch((e) => {});
// });

// afterAll(() => container.resolve(UserAuthService).signOut());

let category: IUserCategory | null = null;

describe("category insertion", () => {
  test("category instantiation", () =>
    (async () => {
      category = await container
        .resolve(UserCategoryFlyweight)
        .insert(
          new UserCategory(
            "",
            "",
            "テストカテゴリ",
            AccountType.TYPE_SPENDING,
            ""
          )
        );

      if (!category) {
        return;
      }

      expect(category.id).not.toBe("");
      expect(category.userId).not.toBe("");
      expect(category.name).toBe("テストカテゴリ");
    })());

  test("category aquiring from flyweight", () => {
    if (!category) {
      return;
    }

    const fCategory = container.resolve(UserCategoryFlyweight).get(category.id);
    expect(fCategory).not.toBe(undefined);

    if (!fCategory) {
      return;
    }

    expect(category.id).toBe(fCategory.id);
    expect(category.userId).toBe(fCategory.userId);
    expect(category.name).toBe(fCategory.name);
  });

  test("category aquiring from firestore", () =>
    (async () => {
      if (!category) {
        return;
      }

      const bCategoryDoc = await firebase
        .firestore()
        .collection("userCategory")
        .doc(category.id)
        .get();

      expect(bCategoryDoc.exists).toBe(true);

      if (!bCategoryDoc.exists) {
        return;
      }
      const bCategory = bCategoryDoc.data();

      if (!bCategory) {
        return;
      }

      expect(category.id).toBe(bCategoryDoc.id);
      expect(category.userId).toBe(bCategory.userId);
      expect(category.name).toBe(bCategory.name);
    })());
});

let item: IUserCategoryItem | null = null;

describe("item insertion", () => {
  test("item instantiation", () =>
    (async () => {
      if (!category) {
        return;
      }
      item = await container
        .resolve(UserCategoryItemFlyweight)
        .insert(
          new UserCategoryItem(
            "",
            "",
            category.id,
            "テストアイテム",
            "",
            false,
            []
          )
        );

      if (!item) {
        return;
      }

      expect(item.id).not.toBe("");
      expect(item.userId).not.toBe("");
      expect(item.name).toBe("テストアイテム");
    })());

  test("item aquiring from flyweight", () => {
    if (!item) {
      return;
    }

    const fItem = container.resolve(UserCategoryItemFlyweight).get(item.id);
    expect(fItem).not.toBe(undefined);

    if (!fItem) {
      return;
    }

    expect(item.id).toBe(fItem.id);
    expect(item.userId).toBe(fItem.userId);
    expect(item.name).toBe(fItem.name);
  });

  test("item aquiring from firestore", () =>
    (async () => {
      if (!item) {
        return;
      }

      const bItemDoc = await firebase
        .firestore()
        .collection("userCategoryItem")
        .doc(item.id)
        .get();

      expect(bItemDoc.exists).toBe(true);

      if (!bItemDoc.exists) {
        return;
      }
      const bItem = bItemDoc.data();

      if (!bItem) {
        return;
      }

      expect(item.id).toBe(bItemDoc.id);
      expect(item.userId).toBe(bItem.userId);
      expect(item.name).toBe(bItem.name);
    })());
});
