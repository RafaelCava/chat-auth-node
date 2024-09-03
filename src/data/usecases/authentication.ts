import { Encrypter, HashComparer } from "@/data/protocols/criptography";
import { AuthenticationUseCase } from "@/domain/usecases";
import { FindUserByEmailRepository } from "@/data/protocols/db";
import { AccessDeniedError, UserNotExistsError } from "@/presentation/erros";

export class Authentication implements AuthenticationUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(
    params: AuthenticationUseCase.Params,
  ): Promise<AuthenticationUseCase.Result> {
    const user = await this.findUserByEmailRepository.findByEmail({
      email: params.email,
      projection: ["id", "email", "password"],
    });
    if (!user) {
      throw new UserNotExistsError();
    }
    const isAuthenticated = await this.hashComparer.compare(
      params.password,
      user.password,
    );
    if (!isAuthenticated) {
      throw new AccessDeniedError();
    }
    const accessToken = await this.encrypter.encrypt(user.id, "3h");
    const refreshToken = await this.encrypter.encrypt(user.id, "2d");
    return {
      accessToken,
      refreshToken,
    };
  }
}
