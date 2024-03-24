import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'

const Router = express.Router()

//request, response
//check api /v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis v1 are ready to use.', code: StatusCodes.OK })
})

// board api
Router.use('/boards', boardRoute)

// column api
Router.use('/columns', columnRoute)

// card api
Router.use('/cards', cardRoute)

export const APIs_V1 = Router