import { Message } from "@/domain/entities";

export interface SendMessageUseCase {
  send(data: SendMessageUseCase.Params): Promise<SendMessageUseCase.Response>;
}

export namespace SendMessageUseCase {
  export type Params = {
    content: string;
    roomId: string;
    ownerId: string;
    createdAt: Date;
  };

  export type Response = Message;
}
