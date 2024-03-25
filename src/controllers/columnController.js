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

const update = async (req, res, next) => {
  try {
    // console.log( 'req.params', req.params) //http://localhost:8017/v1/boards/id-123?author=hodev&height=170cm
    //params: Khi bạn gửi một yêu cầu đến /users/123, Express sẽ trích xuất giá trị 123 và đặt nó vào req.params.userId.
    //Bạn có thể sử dụng giá trị params trong xử lý route để thực hiện các hành động như truy vấn cơ sở dữ liệu
    //để lấy thông tin về người dùng có userId là 123.
    const columnId = req.params.id

    const updatedColumn = await columnService.update(columnId, req.body)

    res.status(StatusCodes.OK).json(updatedColumn)
  }
  catch (error) {
    next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    // console.log( 'req.params', req.params) //http://localhost:8017/v1/boards/id-123?author=hodev&height=170cm
    const columnId = req.params.id

    const result = await columnService.deleteItem(columnId)

    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  update,
  deleteItem
}