/* eslint-disable default-param-last */
import { faker } from "@faker-js/faker";
import { MaxStringLengthValidation } from "@/validation/validators";
import { MaxStringLengthError } from "@/presentation/erros";

const makeSut = ({
  fieldName = faker.color.human(),
  maxLength = faker.number.int({ min: 1, max: 100 }),
}) => new MaxStringLengthValidation(fieldName, maxLength);

describe("MaxStringLengthValidation", () => {
  it("should be defined", () => {
    expect(makeSut({})).toBeDefined();
  });

  it("Should return error if string length is greater than max length", async () => {
    const sut = makeSut({});
    const error = await sut.validate({
      // eslint-disable-next-line dot-notation
      [sut["fieldName"]]: faker.lorem.words(sut["maxLength"] + 1),
    });
    expect(error).toEqual(
      // eslint-disable-next-line dot-notation
      new MaxStringLengthError(sut["fieldName"], sut["maxLength"]),
    );
  });

  it("Should return null if validation is success", async () => {
    const sut = makeSut({});
    const error = await sut.validate({
      // eslint-disable-next-line dot-notation
      [sut["fieldName"]]: faker.string.alpha(sut["maxLength"]),
    });
    expect(error).toBeNull();
  });
});
