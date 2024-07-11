import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeCreateUserController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/users', adaptRoute(makeCreateUserController()))
}