
// Khi bạn import 'dotenv/config', thư viện sẽ tự động tải tệp .env từ thư mục gốc của dự án của bạn 
// và cấu hình các biến môi trường được xác định trong tệp đó.
// console.log('from environment: ', process.env.MONGODB_URI)
import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR
}