import "reflect-metadata";
import DependencyInjectionConfig from "../src/config/DependencyInjectionConfig";
import StabBadgetRepository from "../src/repository/stab/StabBadgetRepository";
import StabBadgetGroupRepository from "../src/repository/stab/StabBadgetGroupRepository";

// テストの前のセッティング
beforeAll(() => {
  DependencyInjectionConfig.runLocal();
  (container.resolve("BadgetRepository") as StabBadgetRepository).clearAll();
  (container.resolve(
    "BadgetGroupRepository"
  ) as StabBadgetGroupRepository).clearAll();
});

import { container } from "tsyringe";
import BadgetService from "../src/service/BadgetService";

test("create new badget", done => {
  container
    .resolve(BadgetService)
    .createAndInsertNewBadgetGroup("家賃")
    .then(group => {
      return container
        .resolve(BadgetService)
        .createAndInsertThisMonthsBadget(group, 2500);
    })
    .then(badget => {
      expect(badget.id).toBe("1");
      done();
    })
    .catch(err => {
      done(err);
    });
});
