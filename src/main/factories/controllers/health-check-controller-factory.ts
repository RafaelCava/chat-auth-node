import { HealthCheckController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeHealthCheckValidation } from '../validators'

export const makeHealthCheckController = (): Controller => {
  return new HealthCheckController(makeHealthCheckValidation())
}