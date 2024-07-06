import { ValidationSpy } from "@/tests/presentation/mocks";
import { ValidationComposite } from "@/validation/validators";

const makeSut = () => {
  const validationSpy = new ValidationSpy()
  const sut = new ValidationComposite([validationSpy])
  return {
    validationSpy,
    sut
  }
}

describe("ConnectMongoDatabaseValidation", () => {
  it("should be defined", () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })

  it("should return an error if any validation fails", async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new Error("Validation fails")
    const error = await sut.validate({})
    expect(error).toEqual(new Error("Validation fails"))
  })
});