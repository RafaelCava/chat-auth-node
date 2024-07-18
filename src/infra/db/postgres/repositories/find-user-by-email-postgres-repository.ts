import { FindUserByEmailRepository } from "@/data/protocols/db";
import { PostgresHelper } from "../helpers/postgres-helper";

export class FindUserByEmailPostgresRepository implements FindUserByEmailRepository {
  findByEmail(params: FindUserByEmailRepository.Params): Promise<FindUserByEmailRepository.Result> {
    const query = {
      where: {
        email: params.email
      }
    }
    if (params.projection && params.projection.length) {
      query['select'] = PostgresHelper.formateProjection(params.projection)
    }
    const user = PostgresHelper.client.user.findUnique(query)
    return user
  }
}