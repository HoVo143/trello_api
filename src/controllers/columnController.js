import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdColumn = await columnService.createNew(req.body)
    // có kết quả thì trả về
    res.status(StatusCodes.CREATED).json(createdColumn)
  }
  catch (error) {
    // nó sẽ chuyển luồng điều khiển đến middleware error handling được đăng ký bởi app.use() với ba tham số (err, req, res, next).
    next(error)
    // mã 500 (INTERNAL_SERVER_ERROR): lỗi server
  }
}

export const columnController = {
  createNew
}