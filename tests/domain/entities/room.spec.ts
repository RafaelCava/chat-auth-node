import { Room } from '@/domain/entities';
import { faker } from '@faker-js/faker';

describe('Room Entities', () => {
  it('Should be defined', () => {
    const sut = new Room({
      description: faker.lorem.sentence(5),
      name: faker.person.fullName(),
      ownerId: faker.string.uuid()
    })
    expect(sut).toBeDefined()
  })
})