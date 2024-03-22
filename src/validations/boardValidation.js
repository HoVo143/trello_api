
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  // mặc định ta ko cần phải custom message ở phía BE vì để cho FE tự validate và custom message ở phía FE cho đẹp
  // BE chỉ cần validate đảm bảo dữ liệu cho chuẩn xác, và trả về message mặc định từ thư viện là được
  // Validate là dữ liệu bắt buộc phải có ở phía BE, vì là điểm cuối để lưu trữ dữ liệu vào database
  // điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả BE và FE
  const correctCondition = Joi.object({
    //required: bắt buộc, min: tối thiểu 3 ký tự, max: tối đa 50 ký tự
    //trim() phải đi chung với strict(): làm cho ko có khoảng trống ở đầu và cuối ở dữ liệu
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'title is required',
      'string.trim': 'title must not have leading or trailing whitespace',
      'string.empty': 'title is not allowed to be empty',
      'string.min': 'title min 3',
      'string.max': 'title max 50'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()

  })
  try {
    // console.log( 'req.body', req.body)
    // abortEarly mặc định là true kiểm tra xem validate có dừng sớm hay ko / đổi nó về false để hiển thị tất cả dữ liệu rỗng 
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // kiểm tra xem cái req.body dữ liệu gửi lên nó có đúng với thực thể correctCondition nó có phù hợp với đk dữ liệu đưa lên ko

    //dùng next để khi boardValidation.createNew chạy oke, hợp lệ rồi sẽ sang boardController.createNew
    next()

  } catch (error) {
    // console.log(error)
    // console.log(new Error(error)) //trả về kiểu string
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    }) // mã 422 (UNPROCESSABLE_ENTITY): dữ liệu ko thể thực thi
  }
}

export const boardValidation = {
  createNew
}