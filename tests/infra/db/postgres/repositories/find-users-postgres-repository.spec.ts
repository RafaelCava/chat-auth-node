import { FindUsersPostgresRepository } from '@/infra/db/postgres/repositories';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          findMany: jest.fn().mockResolvedValueOnce([{ id: 'any_id' }])
        }
      }
    })
  }
})

const makeSut = () => {
  const sut = new FindUsersPostgresRepository()
  return {
    sut
  }
}

describe('FindUserByEmailPostgresRepository', () => {
  let prismaMock: PrismaClient;

  beforeEach(() => {
    prismaMock = new PrismaClient()
    PostgresHelper.client = prismaMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('Should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })

  it('Should call findMany with correct params', async () => {
    const { sut } = makeSut()
    const params = { limit: faker.number.int(), page: faker.number.int(), projection: ['id', 'email'] as any }
    await sut.findAll(params)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      select: {
        id: true,
        email: true
      }
    })
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1)
  })

  it('Should call findMany with correct params without projection', async () => {
    const { sut } = makeSut()
    const params = { limit: faker.number.int(), page: faker.number.int() }
    await sut.findAll(params)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      select: {}
    })
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1)
  })

  it('Should return a list of users', async () => {
    const { sut } = makeSut()
    const params = { limit: faker.number.int(), page: faker.number.int(), projection: ['id', 'email'] as any }
    const result = await sut.findAll(params)
    expect(result).toEqual([{ id: 'any_id' }])
  })
})