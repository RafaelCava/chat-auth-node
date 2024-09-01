import { Message } from "@/domain/entities";
import { Controller, HttpResponse } from "@/presentation/protocols";

export class SendMessageController implements Controller<SendMessageController.Request, SendMessageController.Response> {
  async handle (request: SendMessageController.Request): Promise<HttpResponse<SendMessageController.Response>> {
    await Promise.resolve(request)
    return null;
  }
}

export namespace SendMessageController {
  export type Request = {
    content: string;
    room: string;
    userId: string;
    createdAt?: string;
  };

  export type Response = Message;
}