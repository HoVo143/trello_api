import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
//chỉ định ra những Fields mà chúng ta ko muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createAt']

const validateBeforeCreate = async (data) => {
  // abortEarly mặc định là true kiểm tra xem validate có dừng sớm hay ko / đổi nó về false để hiển thị tất cả dữ liệu rỗng
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) // kiểm tra xem cái req.body dữ liệu gửi lên nó có đúng với thực thể correctCondition nó có phù hợp với đk dữ liệu đưa lên ko
}

const createNew = async (data) => {
  try {
    // sau khi đã dc kiểm tra sẽ insert vô mongodb
    const validData = await validateBeforeCreate(data)

    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    // Phương thức insertOne(data) được sử dụng trong MongoDB, sử dụng để thêm một tài liệu mới chứa dữ liệu được
    // chỉ định bởi đối số data vào bộ sưu tập (collection) được chỉ định.
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd) //"insertedId": "65fdbba09304f3e7c039a70e"
    return createdCard
  }
  catch (error) {
    throw new Error(error)
  }
}

//khi làm backend sẽ gặp rất nhiều
// findOneById chỉ để lấy dữ liệu board
const findOneById = async(cardId) => {
  try {
    //Phương thức findOne() trong MongoDB được sử dụng để tìm kiếm và trả về một tài liệu đầu tiên trong bộ sưu tập (collection)
    // thỏa mãn điều kiện tìm kiếm được chỉ định
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ //nếu dùng thêm toString() thì id sẽ là dạng string thì findOne ko thể dò id ra dữ liệu trong database
      _id: new ObjectId(cardId)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // kiểm tra dữ liệu ,lấy các key của updateData
    // xóa đi các key như : _id và createAt, vì ko thể để update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    //đối với những dữ liệu liên quan objectId, biến đổi ở đây
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    //findOneAndUpdate tìm 1 bản ghi và sau đó cập nhật
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { ReturnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async(columnId) => { // vi truyen sang columnId
  try {

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      _id: new ObjectId(columnId)
    })
    // console.log(result)
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}