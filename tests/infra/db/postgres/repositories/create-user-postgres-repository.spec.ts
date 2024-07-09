import { CreateUserPostgresRepository } from "@/infra/db/postgres/repositories"

const makeSut = () => {
  return new CreateUserPostgresRepository()
}

describe('CreateUserPostgresRepository', () => {
  it('Should be defined', () => {
    expect(makeSut()).toBeDefined()
  })
})