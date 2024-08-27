import { Room } from "@/domain/entities";
import { Controller, HttpResponse, Validation } from "../protocols";
import { badRequest, ok, serverError } from "../helpers/http-helper";
import { ListAllRoomsUseCase } from "@/domain/usecases";

export class ListAllRoomsController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly listAllRooms: ListAllRoomsUseCase,
  ) {}
  
  async handle (request: ListAllRoomsController.Request): Promise<HttpResponse<ListAllRoomsController.Result>> {
    try {
      const error = await this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { limit, page, name, ownerId } = request
      const rooms = await this.listAllRooms.listAll({
        limit: Number(limit),
        page: Number(page),
        name,
        ownerId
      })
      return ok(rooms)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ListAllRoomsController {
  export type Request = {
    ownerId?: string;
    name?: string;
    limit: string;
    page: string;
  }

  export type Result = Room[] | null | Error
}