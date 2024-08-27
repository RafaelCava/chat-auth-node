import { FindRoomsPostgresRepository } from '@/infra/db/postgres/repositories';

const makeSut = () => new FindRoomsPostgresRepository()

describe('FindRoomsPostgresRepository', () => {
  it('Should be defined', () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })
})