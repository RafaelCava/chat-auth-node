import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoginController, makeRefreshTokenController, makeShowProfileController } from '@/main/factories/controllers'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/refresh', adaptRoute(makeRefreshTokenController()))
  router.get('/profile', auth, adaptRoute(makeShowProfileController()))
  router.use('/auth', router)
}