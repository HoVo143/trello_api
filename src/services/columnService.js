import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async(reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newColumn = {
      ...reqBody
    }
    // gọi tới tầng model để xử lý lưu bản ghi newColumn vào trong database
    const createdColumn = await columnModel.createNew(newColumn)
    // lấy bản ghi column sau khi gọi (tùy mục đích dự án có cần bước này hay ko)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // .....
    if (getNewColumn) {
      //xử lý cấu trucs data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = []
      //cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    // nếu ko có return sẽ ko có kết quả trả về cho controller / luôn phải có return trong service
    return getNewColumn
  }
  catch (error) { throw new Error(error) }
}

const update = async(columnId, reqBody) => {
  try {

    const updateData = {
      ...reqBody, //toàn bộ dữ liệu client gửi lên
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  }
  catch (error) { throw new Error(error) }
}

const deleteItem = async(columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!columnId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'column not found')
    }
    // xem Delete document trong mongodb
    // xóa column
    await columnModel.deleteOneById(columnId)
    // xóa toàn bộ cards thuộc cái column trên
    await cardModel.deleteManyByColumnId(columnId)

    //xóa columnId trong mảng columnOrderIds của cái Board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted Successfully!' }
  }
  catch (error) { throw new error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}


