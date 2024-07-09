import { CreateUserRepository, FindUserByEmailRepository } from '@/data/protocols';
import { User } from '@/domain/entities';
import { CreateUserUseCase } from "@/domain/usecases";
import { UserExistsError } from '@/presentation/erros';

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository
  ) { }
  
  async create(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Response> {
    const validateIfUserExists = await this.findUserByEmailRepository.findByEmail({ email: data.email, projection: ['id'] })
    if (validateIfUserExists) {
      throw new UserExistsError()
    }
    const userToCreate = new User(data)
    const user = await this.createUserRepository.create(userToCreate)
    delete user.password
    return user
  }
}