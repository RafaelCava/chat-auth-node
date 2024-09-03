import { SendMessageController } from "@/presentation/controllers/messages";
import { Controller } from "@/presentation/protocols";

export const makeSendMessageControllerFactory = (): Controller =>
  new SendMessageController();
