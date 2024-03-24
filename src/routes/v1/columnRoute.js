import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/')
  //sử dụng next() bên file columnValidation để khi columnValidation.createNew chạy oke rồi sẽ sang columnController.createNew
  .post(columnValidation.createNew, columnController.createNew) //sử dụng post để tạo mới bảng

export const columnRoute = Router
