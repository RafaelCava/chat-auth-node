import { faker } from "@faker-js/faker";
import { Message } from "@/domain/entities";

export const makeMessage = (params: any): Message => ({
  id: faker.string.uuid(),
  content: faker.lorem.sentence(3),
  ownerId: params.ownerId || faker.string.uuid(),
  roomId: params.roomId || faker.string.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});
