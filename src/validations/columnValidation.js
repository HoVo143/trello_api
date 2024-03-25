
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

const update = async (req, res, next) => {
  // ko dùng required() trong trường hợp update
  const correctCondition = Joi.object({
    // nếu cần làm tính năng di chuyển Column sang board khác thì mới thêm validate boardId
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )

  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true // đối với trường hợp update, cho phép unknown để ko cần đẩy một số field lên
    })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, Error(error).message)) // mã 422 (UNPROCESSABLE_ENTITY): dữ liệu ko thể thực thi
  }
}

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  })
  try {
    //params: Khi bạn gửi một yêu cầu đến /users/123, Express sẽ trích xuất giá trị 123 và đặt nó vào req.params.userId.
    //Bạn có thể sử dụng giá trị params trong xử lý route để thực hiện các hành động như truy vấn cơ sở dữ liệu
    //để lấy thông tin về người dùng có userId là 123.
    await correctCondition.validateAsync(req.params)
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, Error(error).message)) // mã 422 (UNPROCESSABLE_ENTITY): dữ liệu ko thể thực thi
  }
}

export const columnValidation = {
  createNew,
  update,
  deleteItem
}