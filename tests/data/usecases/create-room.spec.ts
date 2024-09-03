import MockDate from "mockdate";
import { faker } from "@faker-js/faker";
import { CreateRoom } from "@/data/usecases";
import { Room } from "@/domain/entities";
import { RoomNameAlreadyInUseError } from "@/presentation/erros";
import { CreateRoomRepositorySpy, FindRoomByNameRepositorySpy } from "../mocks";

type SutTypes = {
  sut: CreateRoom;
  findRoomByNameRepositorySpy: FindRoomByNameRepositorySpy;
  createRoomRepositorySpy: CreateRoomRepositorySpy;
};

const makeSut = (): SutTypes => {
  const findRoomByNameRepositorySpy = new FindRoomByNameRepositorySpy();
  const createRoomRepositorySpy = new CreateRoomRepositorySpy();
  const sut = new CreateRoom(
    findRoomByNameRepositorySpy,
    createRoomRepositorySpy,
  );
  return {
    sut,
    findRoomByNameRepositorySpy,
    createRoomRepositorySpy,
  };
};

const makeParams = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.sentence(3),
  ownerId: faker.string.uuid(),
});

describe("CreateRoom", () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("Should be defined", () => {
    const { createRoomRepositorySpy, findRoomByNameRepositorySpy, sut } =
      makeSut();
    expect(sut).toBeDefined();
    expect(createRoomRepositorySpy).toBeDefined();
    expect(findRoomByNameRepositorySpy).toBeDefined();
  });

  describe("FindRoomByNameRepository", () => {
    it("Should call FindRoomByNameRepository with correct values", async () => {
      const { findRoomByNameRepositorySpy, sut } = makeSut();
      findRoomByNameRepositorySpy.returnNull = true;
      const params = makeParams();
      await sut.create(params);
      expect(findRoomByNameRepositorySpy.count).toBe(1);
      expect(findRoomByNameRepositorySpy.params).toEqual({
        name: params.name,
        projection: ["id"],
      });
    });

    it("Should throw if FindRoomByNameRepository throws", async () => {
      const { findRoomByNameRepositorySpy, sut, createRoomRepositorySpy } =
        makeSut();
      findRoomByNameRepositorySpy.returnError = true;
      const promise = sut.create(makeParams());
      await expect(promise).rejects.toThrow(
        findRoomByNameRepositorySpy.errorValue,
      );
      expect(createRoomRepositorySpy.count).toBe(0);
    });

    it("Should throw if FindRoomByNameRepository returns a room", async () => {
      const { sut, createRoomRepositorySpy } = makeSut();
      const promise = sut.create(makeParams());
      await expect(promise).rejects.toThrow(new RoomNameAlreadyInUseError());
      expect(createRoomRepositorySpy.count).toBe(0);
    });
  });

  describe("CreateRoomRepository", () => {
    it("Should call CreateRoomRepository with correct values", async () => {
      const { createRoomRepositorySpy, sut, findRoomByNameRepositorySpy } =
        makeSut();
      findRoomByNameRepositorySpy.returnNull = true;
      const params = makeParams();
      await sut.create(params);
      expect(createRoomRepositorySpy.count).toBe(1);
      expect(createRoomRepositorySpy.params).toEqual({
        ...new Room(params),
        id: expect.any(String),
      });
    });

    it("Should throw if CreateRoomRepository throws", async () => {
      const { createRoomRepositorySpy, sut, findRoomByNameRepositorySpy } =
        makeSut();
      findRoomByNameRepositorySpy.returnNull = true;
      createRoomRepositorySpy.returnError = true;
      const promise = sut.create(makeParams());
      await expect(promise).rejects.toThrow(createRoomRepositorySpy.errorValue);
    });

    it("Should return a room on success", async () => {
      const { createRoomRepositorySpy, sut, findRoomByNameRepositorySpy } =
        makeSut();
      findRoomByNameRepositorySpy.returnNull = true;
      const result = await sut.create(makeParams());
      expect(result).toEqual(createRoomRepositorySpy.result);
    });
  });
});
