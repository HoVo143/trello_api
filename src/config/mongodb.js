
//mNxVgbEX8tVd3LYO

const MONGODB_URI = 'mongodb+srv://congho110201:mNxVgbEX8tVd3LYO@cluster0-hodev.nf2ifec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-HoDev'
const DATABASE_NAME = 'trello-hodev-mern-stack-pro'

import { MongoClient, ServerApiVersion } from 'mongodb'

//khởi tạo 1 đối tượng trelloDatabaseInstance ban đầu là null ( vì chưa connect)
let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  // lưu ý: serverApi có từ phiền bản mongoDB 5.0.0 trở lên, có thể ko cần dùng nó,
  // còn nếu dùng thì sẽ phải chỉ định cái Api Version của mongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
//14:24