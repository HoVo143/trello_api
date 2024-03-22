
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createNew = async(reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard)
    console.log(createdBoard)
    // lấy bản ghi board sau khi gọi (tùy mục đích dự án có cần bước này hay ko)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId.toString())
    console.log(getNewBoard)
    // làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án
    // bắn email, notification về cho admin khi có 1 cái board mới được tạo ra

    // nếu ko có return sẽ ko có kết quả trả về cho controller / luôn phải có return trong service
    return getNewBoard
  }
  catch (error) { throw new error }
}

export const boardService = {
  createNew
}