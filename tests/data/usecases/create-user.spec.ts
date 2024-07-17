import { CreateUserRepositorySpy, FindUserByEmailRepositorySpy } from '../mocks/repositories';
import { UserExistsError } from '@/presentation/erros';
import { CreateUser } from '@/data/usecases';
import { User } from '@/domain/entities';
import { faker } from '@faker-js/faker';
import MockDate from 'mockdate'
import { Spy } from '@/tests/shared/spy';
import { Hasher } from '../protocols/criptography';

type SutTypes = {
  sut: CreateUser
  findUserByEmailRepositorySpy: FindUserByEmailRepositorySpy
  hasherSpy: HasherSpy
  createUserRepositorySpy: CreateUserRepositorySpy
}

class HasherSpy implements Hasher, Spy {
  params: string;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: string = faker.lorem.word({ length: 10 });
  async hash (value: string): Promise<string> {
    this.params = value
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  const sut = new CreateUser(findUserByEmailRepositorySpy, hasherSpy, createUserRepositorySpy)
  
  return {
    sut,
    findUserByEmailRepositorySpy,
    hasherSpy,
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
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy, hasherSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(findUserByEmailRepositorySpy).toBeDefined()
    expect(createUserRepositorySpy).toBeDefined()
    expect(hasherSpy).toBeDefined()
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

  it('Should call Hasher with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy, hasherSpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    const params = makeParams()
    await sut.create(params)
    expect(hasherSpy.params).toBe(params.password)
    expect(hasherSpy.count).toBe(1)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, findUserByEmailRepositorySpy, hasherSpy, createUserRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    hasherSpy.returnError = true
    const params = makeParams()
    const promise = sut.create(params)
    await expect(promise).rejects.toThrow(hasherSpy.errorValue)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(hasherSpy.count).toBe(1)
    expect(createUserRepositorySpy.count).toBe(0)
  })

  it('should call createUserRepository with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy, createUserRepositorySpy, hasherSpy } = makeSut()
    findUserByEmailRepositorySpy.returnNull = true
    const params = makeParams()
    await sut.create(params)
    expect(findUserByEmailRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.params).toEqual(new User({...params, password: hasherSpy.result}))
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