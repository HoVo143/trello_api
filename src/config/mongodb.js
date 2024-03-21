import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

//khởi tạo 1 đối tượng trelloDatabaseInstance ban đầu là null ( vì chưa connect)
let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // lưu ý: serverApi có từ phiền bản mongoDB 5.0.0 trở lên, có thể ko cần dùng nó,
  // còn nếu dùng thì sẽ phải chỉ định cái Api Version của mongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// kết nối database
export const CONNECT_DB = async () => {
  //gọi kết nối tới mongodb atlas với uri đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()
  // kết nối thành công thì lấy ra database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//đóng kết nối database khi cần
export const CLOSE_DB = async () => {
  console.log('__code da chay vao CLOSE_DB__')
  await mongoClientInstance.close()
}


// function GET_DB (không async) này có nhiệm vụ export ra cái trello database instance sau khi
// đã connect thành công tới mongodb để có thể sd ở nhiều nơi khác nhau trong code
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('must connect to database first!')
  return trelloDatabaseInstance
}
