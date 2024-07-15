import { FindUserByIdPostgresRepository } from '@/infra/db/postgres/repositories';
const makeSut = () => {
  return new FindUserByIdPostgresRepository()
}

describe('FindUserByIdPostgresRepository', () => {
  it('Should be defined', () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })
})