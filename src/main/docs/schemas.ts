import {
  errorSchema,
  loginParamsSchema,
  authenticationResultSchema,
  roomSchema,
  roomsSchema,
  createRoomParamsSchema
} from './schemas/'

export default {
  error: errorSchema,
  loginParams: loginParamsSchema,
  'authentication-result': authenticationResultSchema,
  room: roomSchema,
  rooms: roomsSchema,
  'create-room-params': createRoomParamsSchema
}
