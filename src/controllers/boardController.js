import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // console.log( 'req.body', req.body) //http://localhost:8017/v1/boards

    // điều hướng dữ liệu sang tầng service

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'error hodev')
    // có kết quả thì trả về
    res.status(StatusCodes.CREATED).json({ message: 'POST: Apis create new broad.' })
  }
  catch (error) {
    // nó sẽ chuyển luồng điều khiển đến middleware error handling được đăng ký bởi app.use() với ba tham số (err, req, res, next).
    next(error)

    // mã 500 (INTERNAL_SERVER_ERROR): lỗi server
  }
}

export const boardController = {
  createNew
}