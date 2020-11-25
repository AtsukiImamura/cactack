export default class LackPeriodError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "LackPeriodError";
  }
}
