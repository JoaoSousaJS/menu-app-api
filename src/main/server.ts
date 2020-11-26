import mongoose from 'mongoose'
import 'dotenv/config'
import { app } from '../infra/routes/app'
import { ProcessProtocol } from './protocols/process-protocols'

process.on('uncaughtException', (err: ProcessProtocol) => {
  console.log('UNCAUGHT REJECTION!!Shutting down...')
  console.log(err.name, err.message)
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection succesfull')
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`)
})

process.on('unhandledRejection', (err: ProcessProtocol) => {
  console.log('UNHANDLED REJECTION!!Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
process.on('uncaughtException', (err: ProcessProtocol) => {
  console.log('UNCAUGHT REJECTION!!Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
