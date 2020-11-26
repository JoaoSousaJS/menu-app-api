import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitze from 'express-mongo-sanitize'
import xss from 'xss-clean'
import { globalErrorHandler } from '../../presentation/error/global-handler-error'
import { categoryRouter } from './category/category-routes'
import { AppError } from '../../presentation/error/app-error'

export const app = express()

// set security http headers
app.use(helmet())

// body parser
app.use(express.json({
  limit: '10kb'
}))

// data sanitization against nosql query injection
app.use(mongoSanitze())

// data sanitization against XSS
app.use(xss())

if (process.env.NODE_ENV === 'developlment') {
  console.log(process.env.NODE_ENV)
  app.use(morgan('dev'))
}
app.use('/api/v1/categories', categoryRouter)
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`) as ErrorStatus
  // err.status = 'fail'
  // err.statusCode = 404

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)
