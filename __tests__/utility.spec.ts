import JournalDate from "@/src/model/common/JournalDate";

test("2020/12/31 must be before than 2021/1/1 in JournalDate", () => {
  const before = JournalDate.byDay(2020, 12, 31);
  const after = JournalDate.byDay(2021, 1, 1);
  expect(before.beforeThan(after)).toBe(true);
  expect(after.afterThan(before)).toBe(true);
});

test("2020/12/31 must not be after than or equals to 2021/1/1 in JournalDate", () => {
  const before = JournalDate.byDay(2020, 12, 31);
  const after = JournalDate.byDay(2021, 1, 1);
  expect(before.afterThan(after)).toBe(false);
  expect(after.beforeThan(before)).toBe(false);
  expect(after.equalsTo(before)).toBe(false);
});

test("2020/11/30 must be before than or equals to 2020/12/1 in JournalDate", () => {
  const before = JournalDate.byDay(2020, 11, 30);
  const after = JournalDate.byDay(2021, 12, 1);
  expect(before.beforeThanOrEqualsTo(after)).toBe(true);
  expect(after.afterThanOrEqualsTo(before)).toBe(true);
});

test("2020/11/30 must not be after than or equals to 2020/12/1 in JournalDate", () => {
  const before = JournalDate.byDay(2020, 11, 30);
  const after = JournalDate.byDay(2021, 12, 1);
  expect(before.afterThanOrEqualsTo(after)).toBe(false);
  expect(after.beforeThanOrEqualsTo(before)).toBe(false);
});

test("A day must be equals to itself , before than and equals to itself and after than and equals to itself", () => {
  const day = JournalDate.byDay(2020, 9, 24);
  expect(day.equalsTo(day)).toBe(true);
  expect(day.beforeThanOrEqualsTo(day)).toBe(true);
  expect(day.afterThanOrEqualsTo(day)).toBe(true);
});

test("A day must not be before than or after than itself", () => {
  const day = JournalDate.byDay(2020, 9, 24);
  expect(day.beforeThan(day)).toBe(false);
  expect(day.afterThan(day)).toBe(false);
});
