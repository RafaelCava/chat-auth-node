import { Message } from "@/domain/entities";

export interface CreateMessageRepository {
  create(
    data: CreateMessageRepository.Params,
  ): Promise<CreateMessageRepository.Response>;
}

export namespace CreateMessageRepository {
  export type Params = {
    content: string;
    roomId: string;
    ownerId: string;
    createdAt: Date;
  };

  export type Response = Message;
}
