import { FindRoomByNameRepository } from "@/data/protocols/db"
import { PostgresHelper } from '../helpers/postgres-helper';

export class FindRoomByNamePostgresRepository implements FindRoomByNameRepository {
  async findByName (params: FindRoomByNameRepository.Params): Promise<FindRoomByNameRepository.Result> {
    const query: any = {
      where: {
        name: params.name
      }
    }
    if (params.projection?.length) {
      query.select = PostgresHelper.formateProjection(params.projection)
    }
    return await PostgresHelper.client.room.findFirst(query)
  }
}