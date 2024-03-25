import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/')
  //sử dụng next() bên file columnValidation để khi columnValidation.createNew chạy oke rồi sẽ sang columnController.createNew
  .post(columnValidation.createNew, columnController.createNew) //sử dụng post để tạo mới bảng


Router.route('/:id')
  .put(columnValidation.update, columnController.update) // update
  .delete(columnValidation.deleteItem, columnController.deleteItem)
  // ko nên để tên function là delete và create sẽ báo lỗi

export const columnRoute = Router
