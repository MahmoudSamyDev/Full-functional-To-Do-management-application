const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const sectionSchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  title: {
    type: String,
    default: ''
  }
}, schemaOptions)

module.exports = mongoose.model('Section', sectionSchema)