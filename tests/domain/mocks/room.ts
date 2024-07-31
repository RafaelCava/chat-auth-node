import { Room } from "@/domain/entities";
import { faker } from "@faker-js/faker";

type RoomParams = {
  id?: string
  ownerId?: string
}

export const makeRoom = ({ id = faker.string.uuid(), ownerId = faker.string.uuid() }: RoomParams): Room => {
  return {
    id,
    name: faker.airline.airport().name,
    description: faker.lorem.sentence(),
    ownerId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}