import {
  errorSchema,
  loginParamsSchema,
  authenticationResultSchema,
  roomSchema,
  roomsSchema,
  createRoomParamsSchema,
  createUserParamsSchema,
  userWithoutPasswordSchema,
  usersWithoutPasswordSchema
} from './schemas/'

export default {
  error: errorSchema,
  loginParams: loginParamsSchema,
  'authentication-result': authenticationResultSchema,
  room: roomSchema,
  rooms: roomsSchema,
  'create-room-params': createRoomParamsSchema,
  'create-user-params': createUserParamsSchema,
  'user-without-password': userWithoutPasswordSchema,
  'users-without-password': usersWithoutPasswordSchema
}
