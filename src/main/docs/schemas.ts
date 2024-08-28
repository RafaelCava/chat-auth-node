import {
  errorSchema,
  loginParamsSchema,
  authenticationResultSchema
} from './schemas/'

export default {
  error: errorSchema,
  loginParams: loginParamsSchema,
  'authentication-result': authenticationResultSchema
}
