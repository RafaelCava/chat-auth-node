import { Spy } from "@/tests/shared/spy";
import { Decrypter, Encrypter } from "@/data/protocols/criptography";
import { faker } from "@faker-js/faker";

export class EncrypterSpy implements Encrypter, Spy {
  params: { value: string, expiresIn?: string | number }
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: string = faker.string.alphanumeric(20);
  async encrypt (value: string, expiresIn?: string | number): Promise<string> {
    this.params = {value, expiresIn} 
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}

export class DecrypterSpy implements Decrypter, Spy {
  params: string;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: Decrypter.Result = { id: faker.string.uuid() };
  async decrypt (value: string): Promise<Decrypter.Result> {
    this.params = value
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}