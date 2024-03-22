import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: Apis get list broads.' })
  })
  //sử dụng next() bên file boardValidation để khi boardValidation.createNew chạy oke rồi sẽ sang boardController.createNew
  .post(boardValidation.createNew, boardController.createNew) //sử dụng post để tạo mới bảng

export const boardRoute = Router
