export class MaxStringLengthError extends Error {
  constructor(paramName: string, maxLength: number) {
    super(`The field ${paramName} must have a maximum length of ${maxLength}`);
    this.name = "MaxStringLengthError";
  }
}
