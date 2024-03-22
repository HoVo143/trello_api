import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    // console.log( 'req.query', req.query) //http://localhost:8017/v1/boards?author=hodev&height=170cm
    // console.log( 'req.params', req.params) //http://localhost:8017/v1/boards/id-123?author=hodev&height=170cm
    // console.log( 'req.files', req.files)
    // console.log( 'req.cookies', req.cookies)
    // console.log( 'req.jwtDecoded', req.jwtDecoded)
    console.log( 'req.body', req.body) //http://localhost:8017/v1/boards

    // điều hướng dữ liệu sang tầng service

    // có kết quả thì trả về
    res.status(StatusCodes.CREATED).json({ message: 'POST: Apis create new broad.' })
  }
  catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    }) // mã 500 (INTERNAL_SERVER_ERROR): lỗi server
  }
}

export const boardController = {
  createNew
}