import { FindRoomsRepository } from "@/data/protocols/db";
import { PostgresHelper } from "../helpers/postgres-helper";

export class FindRoomsPostgresRepository implements FindRoomsRepository {
  async find(
    params: FindRoomsRepository.Params,
  ): Promise<FindRoomsRepository.Result> {
    const query: any = {
      take: params.limit,
      skip: (params.page - 1) * params.limit,
    };
    if (params.filters) {
      query.where = params.filters;
    }
    if (params.filters?.name) {
      query.where = {
        ...query.where,
        name: {
          contains: params.filters.name,
        },
      };
    }
    if (params.projection?.length) {
      query.select = PostgresHelper.formateProjection(params.projection);
    }
    return await PostgresHelper.client.room.findMany(query);
  }
}
