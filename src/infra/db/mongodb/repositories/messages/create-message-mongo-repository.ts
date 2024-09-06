import { Model } from "mongoose";
import { CreateMessageRepository } from "@/data/protocols/db";
import { MongoHelper } from "../../helpers/mongo-helper";

export class CreateMessageMongoRepository implements CreateMessageRepository {
  constructor(
    private readonly messageModel: Model<CreateMessageRepository.Response>,
  ) {}

  async create(
    data: CreateMessageRepository.Params,
  ): Promise<CreateMessageRepository.Response> {
    const mongoData = await this.messageModel.create({
      content: data.content,
      ownerId: data.ownerId,
      roomId: data.roomId,
      createdAt: data.createdAt,
    });
    return MongoHelper.map<CreateMessageRepository.Response>(
      mongoData.toJSON(),
    );
  }
}
