import { FindUsersRepository } from "@/data/protocols";
import { PostgresHelper } from "../helpers/postgres-helper";

export class FindUsersPostgresRepository implements FindUsersRepository {
  async findAll(params: FindUsersRepository.Params): Promise<FindUsersRepository.Result> {
    const select = PostgresHelper.formateProjection(params.projection)
    return await PostgresHelper.client.user.findMany({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      select
    })
  }
}