import { ShowProfileUseCase } from "@/domain/usecases";
import { FindUserByIdRepository } from "../protocols/db";

export class ShowProfile implements ShowProfileUseCase {
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
  ) {}

  async show(userId: string): Promise<ShowProfileUseCase.Response> {
    return await this.findUserByIdRepository.findById({
      id: userId,
      projection: ["name", "email", "createdAt", "email", "updatedAt", "id"],
    });
  }
}
