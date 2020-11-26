import { catchAsync } from '../error/catch-async-error'

export const listAll = (Modal): any => {
  return catchAsync(async (req, res, next): Promise<void> => {
    const doc = await Modal.find()

    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    })
  })
}
