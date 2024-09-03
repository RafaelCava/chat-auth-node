export class UserNotExistsError extends Error {
  constructor() {
    super("User not exists");
    this.name = "UserNotExistsError";
  }
}
