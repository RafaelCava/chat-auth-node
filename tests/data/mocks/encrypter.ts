import { Spy } from "@/tests/shared/spy";
import { Encrypter } from "@/data/protocols/criptography";
import { faker } from "@faker-js/faker";

export class EncrypterSpy implements Encrypter, Spy {
  params: string;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: string = faker.string.alphanumeric(20);
  async encrypt (value: string): Promise<string> {
    this.params = value 
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}