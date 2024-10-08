import { faker } from "@faker-js/faker";
import { ListAllRoomsController } from "@/presentation/controllers";
import { ValidationSpy } from "../mocks";
import { ListAllRoomsUseCaseSpy } from "@/tests/domain/mocks";
import {
  badRequest,
  ok,
  serverError,
} from "@/presentation/helpers/http-helper";

type SutTypes = {
  sut: ListAllRoomsController;
  validationSpy: ValidationSpy;
  listAllRoomsUseCaseSpy: ListAllRoomsUseCaseSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const listAllRoomsUseCaseSpy = new ListAllRoomsUseCaseSpy();
  const sut = new ListAllRoomsController(validationSpy, listAllRoomsUseCaseSpy);
  return {
    sut,
    validationSpy,
    listAllRoomsUseCaseSpy,
  };
};

const makeRequest = () => ({
  limit: faker.number.int({ min: 1 }).toString(),
  page: faker.number.int({ min: 1 }).toString(),
  name: faker.lorem.word(),
  ownerId: faker.string.uuid(),
});

describe("ListAllRooms", () => {
  it("Should be defined", () => {
    const { sut, listAllRoomsUseCaseSpy, validationSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(listAllRoomsUseCaseSpy).toBeDefined();
    expect(validationSpy).toBeDefined();
  });

  describe("Validation", () => {
    it("Should call Validation with correct values", async () => {
      const { sut, validationSpy } = makeSut();
      const request = makeRequest();
      await sut.handle(request);
      expect(validationSpy.params).toEqual(request);
      expect(validationSpy.count).toBe(1);
    });

    it("Should badRequest if Validation returns an error", async () => {
      const { sut, validationSpy, listAllRoomsUseCaseSpy } = makeSut();
      validationSpy.returnError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(badRequest(validationSpy.errorValue));
      expect(listAllRoomsUseCaseSpy.count).toBe(0);
    });

    it("Should return serverError if Validation throws", async () => {
      const { sut, validationSpy, listAllRoomsUseCaseSpy } = makeSut();
      validationSpy.throwsError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(serverError(validationSpy.errorValue));
      expect(listAllRoomsUseCaseSpy.count).toBe(0);
    });
  });

  describe("ListAllRoomsUseCase", () => {
    it("Should call ListAllRoomsUseCase with correct values", async () => {
      const { sut, listAllRoomsUseCaseSpy } = makeSut();
      const request = makeRequest();
      await sut.handle(request);
      expect(listAllRoomsUseCaseSpy.params).toEqual({
        limit: Number(request.limit),
        page: Number(request.page),
        filters: {
          ownerId: request.ownerId,
          name: request.name,
        },
      });
      expect(listAllRoomsUseCaseSpy.count).toBe(1);
    });

    it("Should return serverError if ListAllRoomsUseCase throws", async () => {
      const { sut, listAllRoomsUseCaseSpy } = makeSut();
      listAllRoomsUseCaseSpy.returnError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(serverError(listAllRoomsUseCaseSpy.errorValue));
    });

    it("Should return ok with the result of ListAllRoomsUseCase", async () => {
      const { sut, listAllRoomsUseCaseSpy } = makeSut();
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(ok(listAllRoomsUseCaseSpy.result));
    });

    it("Should return ok with the result of ListAllRoomsUseCase - empty data", async () => {
      const { sut, listAllRoomsUseCaseSpy } = makeSut();
      listAllRoomsUseCaseSpy.returnNull = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(ok([]));
    });
  });
});
