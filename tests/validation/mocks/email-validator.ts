import { faker } from "@faker-js/faker";
import { Spy } from "@/tests/shared/spy";
import { EmailValidator } from "@/validation/protocols";

export class EmailValidatorSpy implements EmailValidator, Spy {
  params: string = "";

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  returnFalse?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence());

  result: boolean = true;

  isValid(email: string): boolean {
    this.params = email;
    ++this.count;
    if (this.returnError) {
      throw this.errorValue;
    }
    if (this.returnNull) {
      return null;
    }
    if (this.returnFalse) {
      return false;
    }
    return this.result;
  }
}
