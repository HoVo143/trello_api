import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  // abortEarly mặc định là true kiểm tra xem validate có dừng sớm hay ko / đổi nó về false để hiển thị tất cả dữ liệu rỗng
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) // kiểm tra xem cái req.body dữ liệu gửi lên nó có đúng với thực thể correctCondition nó có phù hợp với đk dữ liệu đưa lên ko
}

const createNew = async (data) => {
  try {
    // sau khi đã dc kiểm tra sẽ insert vô mongodb
    const validData = await validateBeforeCreate(data)
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    // Phương thức insertOne(data) được sử dụng trong MongoDB, sử dụng để thêm một tài liệu mới chứa dữ liệu được
    // chỉ định bởi đối số data vào bộ sưu tập (collection) được chỉ định.
    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd) //"insertedId": "65fdbba09304f3e7c039a70e"
    return createdColumn
  }
  catch (error) {
    throw new Error(error)
  }
}

//khi làm backend sẽ gặp rất nhiều
// findOneById chỉ để lấy dữ liệu board
const findOneById = async(id) => {
  try {
    //Phương thức findOne() trong MongoDB được sử dụng để tìm kiếm và trả về một tài liệu đầu tiên trong bộ sưu tập (collection)
    // thỏa mãn điều kiện tìm kiếm được chỉ định
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ //nếu dùng thêm toString() thì id sẽ là dạng string thì findOne ko thể dò id ra dữ liệu trong database
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}

// Nhiệm vụ function này là push 1 cái giá trị columnId vào cuối mảng columnOrderIds
const pushCardOrderIds = async (card) => {
  try {
    //findOneAndUpdate tìm 1 bản ghi và sau đó cập nhật
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { ReturnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
}