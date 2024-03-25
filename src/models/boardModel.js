import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId, ReturnDocument } from 'mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(...Object.values(BOARD_TYPES)).required(),

  // các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]), //dùng default([]) giá trị mặc định, khi tạo 1 board mới thì columnOrderIds sẽ xét giá trị luôn là mảng rỗng

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false) // xóa mềm, ko xóa hẳn mà sẽ lưu trữ lại bên trang admin
})

//chỉ định ra những Fields mà chúng ta ko muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (data) => {
  // abortEarly mặc định là true kiểm tra xem validate có dừng sớm hay ko / đổi nó về false để hiển thị tất cả dữ liệu rỗng
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) // kiểm tra xem cái req.body dữ liệu gửi lên nó có đúng với thực thể correctCondition nó có phù hợp với đk dữ liệu đưa lên ko
}

const createNew = async (data) => {
  try {
    // sau khi đã dc kiểm tra sẽ insert vô mongodb
    const validData = await validateBeforeCreate(data)
    // Phương thức insertOne(data) được sử dụng trong MongoDB, sử dụng để thêm một tài liệu mới chứa dữ liệu được
    // chỉ định bởi đối số data vào bộ sưu tập (collection) được chỉ định.
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData) //"insertedId": "65fdbba09304f3e7c039a70e"
    return createdBoard
  }
  catch (error) {
    throw new Error(error)
  }
}

//khi làm backend sẽ gặp rất nhiều
// findOneById chỉ để lấy dữ liệu board
//sử dụng để tìm kiếm một tài liệu trong collection của MongoDB dựa trên một id cụ thể.
const findOneById = async(boardId) => {
  try {
    // console.log( 'Id string: ', id)
    //Phương thức findOne() trong MongoDB được sử dụng để tìm kiếm và trả về một tài liệu đầu tiên trong bộ sưu tập (collection)
    // thỏa mãn điều kiện tìm kiếm được chỉ định
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ //nếu dùng thêm toString() thì id sẽ là dạng string thì findOne ko thể dò id ra dữ liệu trong database
      _id: new ObjectId(boardId)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}
// query tổng hợp (aggregate của mongodb) để lấy toàn bộ Columns và Cards thuộc về Board
const getDetails = async(id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { // tìm ra cái board
        _id: new ObjectId(id),
        _destroy: false //phải là false
      } },
      { $lookup:{ //đi tìm đến columns
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id', //là _id của board này
        foreignField: 'boardId', // (như khóa ngoại) tìm đến chỗ collection khác / liên kết column này thuộc board nào
        as: 'columns' // đứng từ th board chạy sang columns tìm đến những cái column nào có boardId của board này
      } },
      { $lookup:{ //đi tìm kiếm
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id', //ở cái collection hiện tại là board (là _id của board này)
        foreignField: 'boardId', // tìm đến chỗ collection khác
        as: 'cards' // tên as: ko cố định mà do chúng ta tự định nghĩa ra
      } }
    ]).toArray() // phải có toArray để trả về dữ liệu chuẩn
    return result[0] || null
    // thường aggregate sẽ trả về mảng và mục đích chỉ lấy 1 phần tử nên dùng result[0] để lấy ra pt đầu tiên
    // còn nếu ko có sẽ trả về null
  }
  catch (error) {
    throw new Error(error)
  }
}
// đẩy 1 ptu columnId vào cuối mảng columnOrderIds
// Nhiệm vụ function này là push 1 cái giá trị columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    //findOneAndUpdate tìm 1 bản ghi và sau đó cập nhật
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )

    return result

  } catch (error) {
    throw new Error(error)
  }
}
// lấy 1 ptu columnId ra khỏi mảng columnOrderIds
// dùng pull trong mongodb ở trường hợp này để lấy 1 ptu ra khỏi mảng rồi xóa nó đi
const pullColumnOrderIds = async (column) => {
  try {
    //findOneAndUpdate tìm 1 bản ghi và sau đó cập nhật
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    // kiểm tra dữ liệu ,lấy các key của updateData
    // xóa đi các key như : _id và createAt, vì ko thể để update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    //đối với những dữ liệu liên quan objectId, biến đổi ở đây
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))
    }
    //findOneAndUpdate tìm 1 bản ghi và sau đó cập nhật
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { ReturnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )

    return result

  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}

//65ffd1f4de0cc75a2b7099d9