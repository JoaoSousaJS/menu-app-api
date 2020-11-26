import { categoryModel } from '../../../data/models/category/category'
import { listAll } from '../../factory/list-all-factory'

export const listCategories = listAll(categoryModel)
