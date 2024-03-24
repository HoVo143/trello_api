
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async(reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log( 'createdBoard', createdBoard)
    // lấy bản ghi board sau khi gọi (tùy mục đích dự án có cần bước này hay ko)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log('getNewBoard', getNewBoard)
    // làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án
    // bắn email, notification về cho admin khi có 1 cái board mới được tạo ra

    // nếu ko có return sẽ ko có kết quả trả về cho controller / luôn phải có return trong service
    return getNewBoard
  }
  catch (error) { throw new Error(error) }
}

const getDetails = async(boardId) => {
  try {

    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'board not found')
    }
    // 1. deep clone board ra 1 cái mới để xử lý, ko ảnh hưởng, tới board ban đầu,
    // tùy mục đích về sau mà có clone deep hay ko
    const resBoard = cloneDeep(board)
    // 2. đưa card về đúng column của nó
    resBoard.columns.forEach( column => {
      // vì ban đầu column._id là dạng objectId nên dùng toString
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // cách 2 dùng .equals trong mongodb object equals
      // column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })
    // 3. xóa mảng cards khỏi board ban đầu (lúc cards nằm song song với columns)
    delete resBoard.cards

    return resBoard
  }
  catch (error) { throw new Error(error) }
}

export const boardService = {
  createNew,
  getDetails
}