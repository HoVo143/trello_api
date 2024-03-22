import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'

const Router = express.Router()

//request, response
//check api /v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis v1 are ready to use.', code: StatusCodes.OK })
})

// board api
Router.use('/boards', boardRoute)

export const APIs_V1 = Router