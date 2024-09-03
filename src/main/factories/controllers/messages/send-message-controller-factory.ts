import { SendMessageController } from "@/presentation/controllers/messages";
import { Controller } from "@/presentation/protocols";
import { makeSendMessageValidationFactory } from "../../validators";
import { CreateMessageMongoRepository } from "@/infra/db/mongodb/repositories";
import { SendMessage } from "@/data/usecases";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { messageSchema } from "@/infra/db/mongodb/schemas";
import { Message } from "@/domain/entities";

export const makeSendMessageControllerFactory = (): Controller => {
  const validations = makeSendMessageValidationFactory();
  const model = MongoHelper.getModel<Message>("messages", messageSchema);
  const createMessageRepository = new CreateMessageMongoRepository(model);
  const sendMessageUseCase = new SendMessage(createMessageRepository);
  return new SendMessageController(validations, sendMessageUseCase);
};
