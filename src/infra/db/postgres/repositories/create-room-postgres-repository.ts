import { type CreateRoomRepository } from "@/data/protocols/db";
import { PostgresHelper } from '../helpers/postgres-helper';

export class CreateRoomPostgresRepository implements CreateRoomRepository {
  
  async create(params: CreateRoomRepository.Params): Promise<CreateRoomRepository.Result> {
    return await PostgresHelper.client.room.create({
      data: {
        name: params.name,
        ownerId: params.ownerId,
        description: params.description,
        createdAt: params.createdAt,
        id: params.id,
        updatedAt: params.updatedAt
      }
    })
  }
}