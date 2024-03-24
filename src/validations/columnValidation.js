
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })
  try {
    // console.log( 'req.body', req.body)
    // abortEarly mặc định là true kiểm tra xem validate có dừng sớm hay ko / đổi nó về false để hiển thị tất cả dữ liệu rỗng
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // kiểm tra xem cái req.body dữ liệu gửi lên nó có đúng với thực thể correctCondition nó có phù hợp với đk dữ liệu đưa lên ko
    //dùng next để khi boardValidation.createNew chạy oke, hợp lệ rồi sẽ sang boardController.createNew
    next()
  } catch (error) {
    // console.log(error)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, Error(error).message)) // mã 422 (UNPROCESSABLE_ENTITY): dữ liệu ko thể thực thi
  }
}

export const columnValidation = {
  createNew
}