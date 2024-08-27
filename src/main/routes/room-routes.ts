import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeCreateRoomController, makeListAllRoomsController } from '@/main/factories/controllers'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/rooms', auth, adaptRoute(makeCreateRoomController()))
  router.get('/rooms', auth, adaptRoute(makeListAllRoomsController()))
}