import { catchAsync } from '../error/catch-async-error'

export const createOne = (Model): any => {
  return catchAsync(async (req,res, next): Promise<void> => {
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    })
  })
}
