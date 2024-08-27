import { Room } from "@/domain/entities"

export interface FindRoomsRepository {
  find: (params: FindRoomsRepository.Params) => Promise<FindRoomsRepository.Result>
}

export namespace FindRoomsRepository {
  export type Params = {
    limit: number
    page: number
    filters?: {
      name?: string
      ownerId?: string
    }
    projection?: Array<keyof Room>
  }

  export type Result = Partial<Room>[]
}