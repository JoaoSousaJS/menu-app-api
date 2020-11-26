/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'dotenv/config'
import { AppError } from './app-error'

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  interface Validator {
    message: string
  }
  const errors = Object.values<Validator>(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () => {
  const message = 'Invalid token. Please login again'
  return new AppError(message, 401)
}

const handleJWTExpiredError = () => {
  const message = 'Your token has expired. Please login again'
  return new AppError(message, 401)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  // Operationa, trusted error: send message  to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

  // programming or other unknown error: don't leak error detail
  } else {
    // 1 Log Error
    console.error('ERROR**:', err)

    // 2 send generic message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    })
  }
}

export function globalErrorHandler (err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = err

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}
