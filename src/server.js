
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // cơ chế Cors để chặn truy cập tài nguyên từ các truy cập độc hại
  // corsOptions giúp tránh mọi nơi có thể truy cập tài nguyên
  app.use(cors(corsOptions))
  // Enable req.body json data
  // /Khi một yêu cầu HTTP gửi đến máy chủ Express với dữ liệu dưới dạng JSON (ví dụ: từ một yêu cầu POST hoặc PUT),
  //middleware này sẽ đọc và phân tích dữ liệu JSON và biến nó thành một đối tượng JavaScript trước khi chuyển nó đến các xử lý yêu cầu tiếp theo.
  app.use(express.json())

  // use api v1
  app.use('/v1', APIs_V1)

  // middlewares xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Khởi động máy chủ
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. __Hello ${env.AUTHOR}, I am running at Host: ${ env.APP_HOST } and Port: ${ env.APP_PORT }`)
  })

  // Xử lý tín hiệu SIGINT (Interrupt Signal) và SIGTERM (Termination Signal)
  process.on('SIGINT', async() => {
    console.log('4.__Exiting__')
    await CLOSE_DB() // Thực hiện các bước để đóng kết nối cơ sở dữ liệu
    process.exit(0) // Thoát với mã 0 (không có lỗi)
  })

  // ko thể sử dụng exitHook vì ko hợp vs window
  // exitHook(() => {
  //   console.log('4. __Exiting__')
  //   CLOSE_DB()
  //   console.log('5. __Exiting__')
  // })
}

// chỉ khi kết nối tới database thành công thì mới star server backend lên
// dạng anonymous async function (từ khóa: IIFE)
(async () => {
  try {
    console.log('1. __connecting to mongodb cloud atlas... ')
    await CONNECT_DB()
    console.log('2. __connected to mongodb cloud atlas!')
    // khởi động server backend sau khi connect database thành công
    START_SERVER()
  }
  catch (error) {
    // khi có lỗi sẽ catch ra xong dùng exit để dừng lại
    console.error(error)
    process.exit(0)
  }
})()

// chỉ khi kết nối tới database thành công thì mới star server backend lên
// console.log('1. connecting to mongodb cloud atlas... ')
// CONNECT_DB()
//   .then(() => console.log('2. connected to mongodb cloud atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     // khi có lỗi sẽ catch ra xong dùng exit để dừng lại
//     process.exit(0)
//   })

