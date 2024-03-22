
import { slugify } from '~/utils/formatters'

const createNew = (reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // nếu ko có return sẽ ko có kết quả trả về cho controller / luôn phải có return trong service
    return newBoard
    // gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong database

    // làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án
    // bắn email, notification về cho admin khi có 1 cái board mới được tạo ra
  }
  catch (error) { throw new error }
}

export const boardService = {
  createNew
}