import express from "express"

const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', function (req, res) {
  res.send('Hello World nodejs hodev')
})

app.listen(port, hostname, () => {
  console.log(`Hello Hodev, i am running server at http://${hostname}:${port}/`)
})