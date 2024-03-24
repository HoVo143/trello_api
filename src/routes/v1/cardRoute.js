import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.route('/')
  //sử dụng next() bên file cardValidation để khi cardValidation.createNew chạy oke rồi sẽ sang cardController.createNew
  .post(cardValidation.createNew, cardController.createNew) //sử dụng post để tạo mới bảng

export const cardRoute = Router
