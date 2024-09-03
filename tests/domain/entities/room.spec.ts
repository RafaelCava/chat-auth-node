import { faker } from "@faker-js/faker";
import { Room } from "@/domain/entities";

describe("Room Entities", () => {
  it("Should be defined", () => {
    const sut = new Room({
      description: faker.lorem.sentence(5),
      name: faker.person.fullName(),
      ownerId: faker.string.uuid(),
    });
    expect(sut).toBeDefined();
  });

  it("Should create a room with use param id", () => {
    const sut = new Room(
      {
        description: faker.lorem.sentence(5),
        name: faker.person.fullName(),
        ownerId: faker.string.uuid(),
      },
      "mock_id",
    );
    expect(sut.id).toBeDefined();
    expect(sut.id).toBe("mock_id");
  });

  it("Should create a room without param id", () => {
    const sut = new Room({
      description: faker.lorem.sentence(5),
      name: faker.person.fullName(),
      ownerId: faker.string.uuid(),
    });
    expect(sut.id).toBeDefined();
    expect(sut.id).not.toBeNull();
    expect(sut.id).not.toBe("");
    expect(sut.id).not.toBeUndefined();
  });
});
