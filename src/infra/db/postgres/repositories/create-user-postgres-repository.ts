import { CreateUserRepository } from "@/data/protocols";
import { PostgresHelper } from "../helpers/postgres-helper";
import {v4 as uuidV4} from 'uuid';
import { User } from "@/domain/entities";

export class CreateUserPostgresRepository implements CreateUserRepository {
  async create (params: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    const uuid = uuidV4()
    return await PostgresHelper.client.user.create({
      data: {
        ...params,
        id: uuid
      } as User
    })
  }
}