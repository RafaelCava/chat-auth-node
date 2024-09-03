import { v4 as uuidV4 } from "uuid";
import { CreateUserRepository } from "@/data/protocols/db";
import { PostgresHelper } from "../helpers/postgres-helper";
import { User } from "@/domain/entities";

export class CreateUserPostgresRepository implements CreateUserRepository {
  async create(
    params: CreateUserRepository.Params,
  ): Promise<CreateUserRepository.Result> {
    const uuid = uuidV4();
    return await PostgresHelper.client.user.create({
      data: {
        ...params,
        id: uuid,
      } as User,
    });
  }
}
