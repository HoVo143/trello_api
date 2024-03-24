import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

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

export const columnService = {
  createNew
}


