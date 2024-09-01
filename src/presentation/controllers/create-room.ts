import { Room } from "@/domain/entities";
import { Controller, HttpResponse, Validation } from "../protocols";
import { badRequest, conflict, created, serverError } from "../helpers/http-helper";
import { CreateRoomUseCase } from "@/domain/usecases";
import { RoomNameAlreadyInUseError } from "../erros";

export class CreateRoomController implements Controller<CreateRoomController.Request> {
  constructor(
    private readonly validation: Validation,
    private readonly createRoom: CreateRoomUseCase
  ) {}
  async handle (request: CreateRoomController.Request): Promise<CreateRoomController.Response> {
    try {
      const error = await this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }
      const room = await this.createRoom.create({
        name: request.name,
        description: request.description,
        ownerId: request.userId
      })
      return created(room)
    } catch (error) {
      if (error instanceof RoomNameAlreadyInUseError) {
        return conflict(error)
      }
      return serverError(error)
    }
  }
}

export namespace CreateRoomController {
  export type Request = {
    name: string
    description?: string
    userId: string
  }

  export type Response = HttpResponse<Result | Error>

  export type Result = Room
}