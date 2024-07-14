import { ListAllUsersUseCase } from "@/domain/usecases";
import { FindUsersRepository } from "../protocols";

export class ListAllUsers implements ListAllUsersUseCase {
  constructor (private readonly findUsersRepository: FindUsersRepository) {}

  async listAll (params: ListAllUsersUseCase.Params): Promise<ListAllUsersUseCase.Result> {
    const users = await this.findUsersRepository.findAll({ 
      limit: params.limit, 
      page: params.page, 
      projection: ['id', 'createdAt', 'email', 'name', 'updatedAt'] 
    })
    return users as ListAllUsersUseCase.Result
  }
}

