import { FindUserByIdPostgresRepository } from '@/infra/db/postgres/repositories';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          findFirst: jest.fn().mockResolvedValueOnce({ id: 'any_id' })
        }
      }
    })
  }
})

const makeSut = () => {
  return new FindUserByIdPostgresRepository()
}

describe('FindUserByIdPostgresRepository', () => {
  let prismaMock: PrismaClient;

  beforeEach(() => {
    prismaMock = new PrismaClient()
    PostgresHelper.client = prismaMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should be defined', () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })

  it('Should call findFirst with correct params', async () => {
    const sut = makeSut()
    const params = { id: faker.string.uuid(), projection: ['id', 'password'] as any }
    await sut.findById(params)
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: params.id
      },
      select: {
        id: true,
        password: true
      }
    })
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1)
  })

  it('Should return a user on success', async () => {
    const sut = makeSut()
    const params = { id: faker.string.uuid(), projection: ['id', 'password'] as any }
    const user = await sut.findById(params)
    expect(user).toEqual({ id: 'any_id' })
  })
})