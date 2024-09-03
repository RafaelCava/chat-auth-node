import { Message } from "@/domain/entities";
import { SendMessageUseCase } from "@/domain/usecases/messages";
import {
  badRequest,
  created,
  serverError,
} from "@/presentation/helpers/http-helper";
import { Controller, HttpResponse, Validation } from "@/presentation/protocols";

export class SendMessageController
  implements
    Controller<SendMessageController.Request, SendMessageController.Response>
{
  constructor(
    private readonly validation: Validation,
    private readonly sendMessageUseCase: SendMessageUseCase,
  ) {}

  async handle(
    request: SendMessageController.Request,
  ): Promise<HttpResponse<SendMessageController.Response>> {
    try {
      const error = await this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const message = await this.sendMessageUseCase.send({
        content: request.content,
        roomId: request.roomId,
        ownerId: request.userId,
        createdAt: request.createdAt ? new Date(request.createdAt) : new Date(),
      });
      return created(message);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace SendMessageController {
  export type Request = {
    content: string;
    roomId: string;
    userId: string;
    createdAt?: string;
  };

  export type Response = Message | Error;
}
