import { FindUserByIdRepository } from "@/data/protocols/db";
import { PostgresHelper } from "../helpers/postgres-helper";

export class FindUserByIdPostgresRepository implements FindUserByIdRepository {
  async findById (params: FindUserByIdRepository.Params): Promise<FindUserByIdRepository.Result> {
    const select = PostgresHelper.formateProjection(params.projection)
    return await PostgresHelper.client.user.findFirst({
      where: {
        id: params.id
      },
      select
    })
  }
}