import "reflect-metadata";
import DependencyInjectionConfig from "../src/config/DependencyInjectionConfig";
import JournalDate from "../src/model/common/JournalDate";
import { CreditDebt } from "../src/model/JournalDetail";
import { container } from "tsyringe";
import JournalService from "../src/service/JournalService";

// テストの前のセッティング
beforeAll(() => {
  DependencyInjectionConfig.runLocal();
});

test("create debts", () => {
  const debts = [];
  let date = JournalDate.today();
  for (let i = 0; i < 5; i++) {
    date = date.getNextMonth();
    debts.push(new CreditDebt("", 2300, date.toString()));
  }
  container.resolve(JournalService).createJournalsOfDebts(debts);
  // console.log(journals);
});
