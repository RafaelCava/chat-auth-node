import {
  errorSchema,
  loginParamsSchema,
  authenticationResultSchema,
  roomSchema,
  roomsSchema
} from './schemas/'

export default {
  error: errorSchema,
  loginParams: loginParamsSchema,
  'authentication-result': authenticationResultSchema,
  room: roomSchema,
  rooms: roomsSchema
}
