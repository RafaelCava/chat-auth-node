import { faker } from "@faker-js/faker";
import { User } from "@/domain/entities";

export const makeUser = (): User => {
  const date = new Date();
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: date,
    updatedAt: date,
  };
};
