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

const getDetails = async (req, res, next) => {
  try {
    // console.log( 'req.params', req.params) //http://localhost:8017/v1/boards/id-123?author=hodev&height=170cm
    const boardId = req.params.id
    //sau này sẽ có thêm userId nữa để chỉ lấy board thuộc về user đó thôi
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  }
  catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    // console.log( 'req.params', req.params) //http://localhost:8017/v1/boards/id-123?author=hodev&height=170cm
    const boardId = req.params.id
    //sau này sẽ có thêm userId nữa để chỉ lấy board thuộc về user đó thôi
    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  }
  catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    //sau này sẽ có thêm userId nữa để chỉ lấy board thuộc về user đó thôi
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}