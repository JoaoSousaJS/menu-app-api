import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  title: string
  color: string
}

const categorySchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: true,
    trim: true
  },
  color: {
    type: String,
    required: [true, 'A color is required'],
    enum: ['#f5428d', '#f54242', '#f5a442', '#f5d142', '#368dff', '#41d95d', '#9eecff', '#b9ffb0', '#ffc7ff', '#47fced']
  }
})

export const categoryModel = mongoose.model<ICategory>('Category', categorySchema)
