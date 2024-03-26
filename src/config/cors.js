
import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
  // đối số origin đại diện cho WHITELIST_DOMAINS
  origin: function (origin, callback) {
    // console.log('origin', origin)
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,

    // nếu môi trường là local dev thì cho qua luôn
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true) // null nghĩa là ko có lỗi / true là kết qả cho phép đi qa
    }

    // ngược lại hiên tại code đang làm còn 1 trường hợp
    // env.BUILD_MODE === 'production'

    // Kiểm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true) // return để ko chạy bên dưới nữa
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  // axios call api sẽ đính kèm cookies vào trong request, và để dùng dc cookie ấy và pass cookie qua code nên cần dùng credentials: true
  credentials: true
  // sau này làm đính kèm jwt access token và refresh token vào httpOnly Cookies
}