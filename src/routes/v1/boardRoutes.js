import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: Apis get list broads.' })
  })
  .post((req, res) => { //sử dụng post để tạo mới bảng
    res.status(StatusCodes.CREATED).json({ message: 'Note: Apis create new broad.' })
  })

export const boardRoutes = Router
