import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async(reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newCard = {
      ...reqBody
    }
    // gọi tới tầng model để xử lý lưu bản ghi newCard vào trong database
    const createdCard = await cardModel.createNew(newCard)
    // lấy bản ghi card sau khi gọi (tùy mục đích dự án có cần bước này hay ko)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    // .....
    if (getNewCard) {
      ///cập nhật mảng cardOrderIds trong collection boards
      await columnModel.pushCardOrderIds(getNewCard)
    }

    // nếu ko có return sẽ ko có kết quả trả về cho controller / luôn phải có return trong service
    return getNewCard
  }
  catch (error) { throw new Error(error) }
}

export const cardService = {
  createNew
}