import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoginController, makeRefreshTokenController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/refresh', adaptRoute(makeRefreshTokenController()))
  router.use('/auth', router)
}