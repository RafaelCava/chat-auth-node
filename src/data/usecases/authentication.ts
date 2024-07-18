import { Encrypter, HashComparer } from '@/data/protocols/criptography';
import { AuthenticationUseCase } from "@/domain/usecases";
import { FindUserByEmailRepository } from "@/data/protocols/db";

export class Authentication implements AuthenticationUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}
  async auth (params: AuthenticationUseCase.Params): Promise<AuthenticationUseCase.Result> {
    return null
  }
}