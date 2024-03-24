import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdCard = await cardService.createNew(req.body)
    // có kết quả thì trả về
    res.status(StatusCodes.CREATED).json(createdCard)
  }
  catch (error) {
    // nó sẽ chuyển luồng điều khiển đến middleware error handling được đăng ký bởi app.use() với ba tham số (err, req, res, next).
    next(error)
    // mã 500 (INTERNAL_SERVER_ERROR): lỗi server
  }
}

export const cardController = {
  createNew
}