import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { faker } from '@faker-js/faker';

export const makeCreateUserUseCaseResponse = (): CreateUserUseCase.Response => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
})