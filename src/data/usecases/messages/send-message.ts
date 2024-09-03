import { CreateMessageRepository } from "@/data/protocols/db/messages";
import { SendMessageUseCase } from "@/domain/usecases/messages";

export class SendMessage implements SendMessageUseCase {
  constructor(
    private readonly createMessageRepository: CreateMessageRepository,
  ) {}

  async send(
    data: SendMessageUseCase.Params,
  ): Promise<SendMessageUseCase.Response> {
    return await this.createMessageRepository.create({
      content: data.content,
      roomId: data.roomId,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
    });
  }
}
