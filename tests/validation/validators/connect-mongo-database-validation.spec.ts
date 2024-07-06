import { ConnectMongoDatabaseValidation } from "@/validation/validators";

const makeSut = () => {
  return new ConnectMongoDatabaseValidation()
}

describe("ConnectMongoDatabaseValidation", () => {
  it("should be defined", () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })
});