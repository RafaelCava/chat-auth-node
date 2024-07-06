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

  it("should call validation with correct values", async () => {
    const { sut, validationSpy } = makeSut()
    const input = {teste: 'teste'}
    await sut.validate(input)
    expect(validationSpy.count).toBe(1)
    expect(validationSpy.params).toEqual(input)
  })

  it("should return an error if any validation fails", async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new Error("Validation fails")
    const error = await sut.validate({})
    expect(error).toEqual(new Error("Validation fails"))
  })

  it("should return an error if any validation throws", async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.throwsError = true
    const error = sut.validate({})
    expect(error).resolves.toThrow(validationSpy.errorValue)
  })
});