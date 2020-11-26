import express from 'express'
import { createCategory, listCategories } from '../../../presentation/controllers/category'

export const categoryRouter = express.Router()

categoryRouter.route('/').post(createCategory).get(listCategories)
