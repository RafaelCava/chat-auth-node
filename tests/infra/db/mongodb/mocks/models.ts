import { faker } from "@faker-js/faker";
import { Message } from "@/domain/entities";
import { Spy } from "@/tests/shared/spy";
import { makeMessage } from "@/tests/domain/mocks";

export class MessageModelSpy implements Spy {
  params: any;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence(3));

  result: Message = makeMessage({});

  async create(data: any) {
    ++this.count;
    this.params = data;
    if (this.returnError) {
      throw this.errorValue;
    }
    if (this.returnNull) {
      return await Promise.resolve(null);
    }
    return await Promise.resolve(this.result);
  }
}
