import JournalDate from "../src/model/common/JournalDate";

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

test("next month", () => {
  const date = JournalDate.byDay(2020, 9, 24).getNextMonth();
  expect(date.month).toBe(10);
  expect(date.day).toBe(24);
});

test("next month 2", () => {
  const date = JournalDate.byDay(2020, 8, 31).getNextMonth();
  expect(date.month).toBe(9);
  expect(date.day).toBe(30);
});

test("next month 3", () => {
  const date = JournalDate.byDay(2020, 12, 1).getNextMonth();
  expect(date.year).toBe(2021);
  expect(date.month).toBe(1);
  expect(date.day).toBe(1);
});

test("prev month", () => {
  const date = JournalDate.byDay(2020, 8, 16).getPreviousMonth();
  expect(date.month).toBe(7);
  expect(date.day).toBe(16);
});

test("prev month 2", () => {
  const date = JournalDate.byDay(2020, 7, 31).getPreviousMonth();
  expect(date.month).toBe(6);
  expect(date.day).toBe(30);
});

test("prev month 3", () => {
  const date = JournalDate.byDay(2020, 1, 31).getPreviousMonth();
  expect(date.year).toBe(2019);
  expect(date.month).toBe(12);
  expect(date.day).toBe(31);
});

test("next day 1", () => {
  const date = JournalDate.byDay(2020, 1, 31).getNextDay();
  expect(date.year).toBe(2020);
  expect(date.month).toBe(2);
  expect(date.day).toBe(1);
});

test("next day 2", () => {
  const date = JournalDate.byDay(2020, 2, 5).getNextDay();
  expect(date.year).toBe(2020);
  expect(date.month).toBe(2);
  expect(date.day).toBe(6);
});

test("cast 1", () => {
  const date = JournalDate.cast("2020/1/31");
  expect(date.year).toBe(2020);
  expect(date.month).toBe(1);
  expect(date.day).toBe(31);
});

test("cast 2", () => {
  const date = JournalDate.cast("2020/1/32");
  expect(date.year).toBe(2020);
  expect(date.month).toBe(1);
  expect(date.day).toBe(31);
});

test("cast 3", () => {
  const date = JournalDate.cast("2020/2/29");
  expect(date.year).toBe(2020);
  expect(date.month).toBe(2);
  expect(date.day).toBe(29);
});

test("cast 4", () => {
  const date = JournalDate.cast("2020/2");
  expect(date.year).toBe(2020);
  expect(date.month).toBe(2);
  expect(date.day).toBe(-1);
});

test("to string 1", () => {
  const date = JournalDate.byDay(2020, 3, 23);
  expect(date.toString()).toBe("2020/3/23");
});

test("to string 2", () => {
  const date = JournalDate.byMonth(2020, 3);
  expect(date.toString()).toBe("2020/3");
});
