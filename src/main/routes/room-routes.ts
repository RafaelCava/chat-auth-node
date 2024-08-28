import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeCreateRoomController, makeListAllRoomsController } from '@/main/factories/controllers'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/', auth, adaptRoute(makeCreateRoomController()))
  router.get('/', auth, adaptRoute(makeListAllRoomsController()))
  router.use('/rooms', router)
}