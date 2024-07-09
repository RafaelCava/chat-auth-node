import { CreateUserRepository } from "@/data/protocols";

export class CreateUserPostgresRepository implements CreateUserRepository {
  async create (params: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    return null
  }
}