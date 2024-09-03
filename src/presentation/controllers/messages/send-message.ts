import { Message } from "@/domain/entities";
import { badRequest } from "@/presentation/helpers/http-helper";
import { Controller, HttpResponse, Validation } from "@/presentation/protocols";

export class SendMessageController
  implements
    Controller<SendMessageController.Request, SendMessageController.Response>
{
  constructor(private readonly validation: Validation) {}

  async handle(
    request: SendMessageController.Request,
  ): Promise<HttpResponse<SendMessageController.Response>> {
    const error: any = await this.validation.validate(request);
    if (error) {
      return badRequest(error);
    }
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

  export type Response = Message | Error;
}
