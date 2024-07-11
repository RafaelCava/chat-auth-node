import { CreateUserRepository } from "@/data/protocols";
import { PostgresHelper } from "../helpers/postgres-helper";

export class CreateUserPostgresRepository implements CreateUserRepository {
  async create (params: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    return await PostgresHelper.client.user.create({
      data: params
    })
  }
}