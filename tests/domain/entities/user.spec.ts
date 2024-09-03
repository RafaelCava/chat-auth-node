import { faker } from "@faker-js/faker";
import { User } from "@/domain/entities/user";

const makeData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

describe("User entity", () => {
  it("should be defined", () => {
    const data = makeData();
    const user = new User(data);
    expect(user).toBeDefined();
    expect(user.email).toBe(data.email);
    expect(user.name).toBe(data.name);
    expect(user.password).toBe(data.password);
    expect(user.id).toBe("");
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("should return user with id", () => {
    const data = makeData();
    const id = faker.string.uuid();
    const user = new User(data, id);
    expect(user).toBeDefined();
    expect(user.email).toBe(data.email);
    expect(user.name).toBe(data.name);
    expect(user.password).toBe(data.password);
    expect(user.id).toBe(id);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
});
