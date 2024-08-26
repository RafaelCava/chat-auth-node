import { FindRoomByNamePostgresRepository } from '@/infra/db/postgres/repositories';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        room: {
          findFirst: jest.fn().mockResolvedValueOnce({ id: 'any_id' })
        }
      }
    })
  }
})

const makeSut = () => {
  return new FindRoomByNamePostgresRepository()
}

describe('FindRoomByNamePostgresRepository', () => {
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
    const params = { name: faker.string.uuid(), projection: ['id'] as any }
    await sut.findByName(params)
    expect(prismaMock.room.findFirst).toHaveBeenCalledWith({
      where: {
        name: params.name
      },
      select: {
        id: true,
      }
    })
    expect(prismaMock.room.findFirst).toHaveBeenCalledTimes(1)
  })

  it('Should return a user on success', async () => {
    const sut = makeSut()
    const params = { name: faker.string.uuid(), projection: ['id'] as any }
    const room = await sut.findByName(params)
    expect(room).toEqual({ id: 'any_id' })
  })
})