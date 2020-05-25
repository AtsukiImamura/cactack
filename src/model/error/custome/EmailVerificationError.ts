import CustomeErrorBase from "./CustomeError";

export default class EmailVerificationError extends CustomeErrorBase {
  constructor(message?: string) {
    super("email-not-verified", message);
  }
}
