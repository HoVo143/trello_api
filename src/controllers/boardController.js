import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log( 'req.body', req.body) //http://localhost:8017/v1/boards

    // điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(req.body)

    // có kết quả thì trả về
    res.status(StatusCodes.CREATED).json(createdBoard)
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