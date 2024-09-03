import {
  CreateUserRepository,
  FindUserByEmailRepository,
} from "@/data/protocols/db";
import { User } from "@/domain/entities";
import { CreateUserUseCase } from "@/domain/usecases";
import { UserExistsError } from "@/presentation/erros";
import { Hasher } from "../protocols/criptography";

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(
    data: CreateUserUseCase.Params,
  ): Promise<CreateUserUseCase.Response> {
    const validateIfUserExists =
      await this.findUserByEmailRepository.findByEmail({
        email: data.email,
        projection: ["id"],
      });
    if (validateIfUserExists) {
      throw new UserExistsError();
    }
    const hashedPassword = await this.hasher.hash(data.password);
    const userToCreate = new User({ ...data, password: hashedPassword });
    const user = await this.createUserRepository.create(userToCreate);
    delete user.password;
    return user;
  }
}
