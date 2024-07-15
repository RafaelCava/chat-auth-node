import { LoadUserByTokenUseCase } from "@/domain/usecases";
import { Decrypter } from "../protocols/criptography";
import { FindUserByIdRepository } from "../protocols/db";

export class LoadUserByToken implements LoadUserByTokenUseCase {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByIdRepository: FindUserByIdRepository
  ) {}

  async load (params: LoadUserByTokenUseCase.Params): Promise<LoadUserByTokenUseCase.Result> {
    const claims = await this.decrypter.decrypt(params.accessToken)
    if (!claims) return null
    const user = await this.findUserByIdRepository.findById({ id: claims.id })
    if (!user) return null
    return {
      id: user.id
    }
  }
}