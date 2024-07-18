import { FindUserByIdRepository } from '@/data/protocols/db';
import { Decrypter, Encrypter } from '@/data/protocols/criptography';
import { RefreshTokenUseCase } from '@/domain/usecases';
import { AccessDeniedError } from '@/presentation/erros';

export class RefreshToken implements RefreshTokenUseCase {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly encrypter: Encrypter
  ) {}
  
  async refreshToken (data: RefreshTokenUseCase.Params): Promise<RefreshTokenUseCase.Result> {
    const claims = await this.decrypter.decrypt(data.refreshToken);
    if (!claims) {
      throw new AccessDeniedError();
    }
    const user = await this.findUserByIdRepository.findById({ id: claims.id });
    if (!user) {
      throw new AccessDeniedError();
    }
    const accessToken = await this.encrypter.encrypt(user.id, '3h')
    const refreshToken = await this.encrypter.encrypt(user.id, '2d')
    return {
      accessToken,
      refreshToken
    }
  }
}