
import { CreateUserRepositorySpy, FindUserByEmailRepositorySpy } from '../mocks/repositories';
import { UserExistsError } from '@/presentation/erros';
import { CreateUser } from '@/data/usecases';
import { User } from '@/domain/entities';
import { faker } from '@faker-js/faker';
import MockDate from 'mockdate'

type SutTypes = {
  sut: CreateUser
  findUserByEmailRepositorySpy: FindUserByEmailRepositorySpy
  createUserRepositorySpy: CreateUserRepositorySpy
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  const sut = new CreateUser(findUserByEmailRepositorySpy, createUserRepositorySpy)
  
  return {
    sut,
    findUserByEmailRepositorySpy,
    createUserRepositorySpy
  }
}

const makeParams = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('CreateUser', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  it('Should be defined', () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    expect(sut).toBeDefined()
    expect(findUserByEmailRepositorySpy).toBeDefined()
  })

  it('Should call FindUserByEmailRepository with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    const params = makeParams()
    await sut.create(params)
    expect(findUserByEmailRepositorySpy.params).toEqual({ email: params.email, projection: ['id'] })
    expect(findUserByEmailRepositorySpy.count).toBe(1)
  })

  it('Should throw if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.throwError = true
    const params = makeParams()
    const promise = sut.create(params)
    await expect(promise).rejects.toThrow(findUserByEmailRepositorySpy.errorValue)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.count).toBe(0)
  })

  it('Should throw UserExistsError if FindUserByEmailRepository returns a user', async () => {
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    const params = makeParams()
    const promise = sut.create(params)
    expect(promise).rejects.toThrow(new UserExistsError())
    expect(createUserRepositorySpy.count).toBe(0)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
  })

  it('should call createUserRepository with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    const params = makeParams()
    await sut.create(params)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.params).toEqual(new User(params))
    expect(createUserRepositorySpy.count).toBe(1)
  })

  it('Should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepositorySpy, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    createUserRepositorySpy.returnError = true
    const params = makeParams()
    const promise = sut.create(params)
    await expect(promise).rejects.toThrow(createUserRepositorySpy.errorValue)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.count).toBe(1)
  })

  it('should return a completed user on success', async () => {
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    const params = makeParams()
    const user = await sut.create(params)
    delete createUserRepositorySpy.result.password
    expect(user).toEqual(createUserRepositorySpy.result)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.count).toBe(1)
  })
});