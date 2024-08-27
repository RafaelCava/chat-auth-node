import { FindRoomsPostgresRepository } from '@/infra/db/postgres/repositories';
import { PrismaClient } from '@prisma/client';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper';

const makeSut = () => new FindRoomsPostgresRepository()

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        room: {
          findMany: jest.fn().mockResolvedValue([{ id: 'any_id' }])
        }
      }
    })
  }
})

describe('FindRoomsPostgresRepository', () => {
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

  it('Should return an array of rooms', async () => {
    const sut = makeSut()
    const params = { limit: 10, page: 1, projection: ['id'] as any }
    const rooms = await sut.find(params)
    expect(rooms).toEqual([{ id: 'any_id' }])
  })

  it('Should return an empty array if no rooms are found', async () => {
    const sut = makeSut()
    const params = { limit: 10, page: 1, projection: ['id'] as any }
    jest.spyOn(PostgresHelper.client.room, 'findMany').mockResolvedValueOnce([])
    const rooms = await sut.find(params)
    expect(rooms).toEqual([])
  })


  it('Should throw if findMany throws', async () => {
    const sut = makeSut()
    const params = { limit: 10, page: 1, projection: ['id'] as any }
    jest.spyOn(PostgresHelper.client.room, 'findMany').mockRejectedValueOnce(new Error('FindManyError'))
    const promise = sut.find(params)
    await expect(promise).rejects.toThrow(new Error('FindManyError'))
  })
})