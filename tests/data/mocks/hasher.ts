import { Spy } from "@/tests/shared/spy";
import { HashComparer } from "@/data/protocols/criptography";
import { faker } from "@faker-js/faker";

export class HashComparerSpy implements HashComparer, Spy {
  params: any;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: boolean = true;
  async compare (value: string, hash: string): Promise<boolean> {
    this.params = { value, hash }
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}