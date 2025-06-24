// Extracts validation errors from express-validator after middleware checks
const { validationResult } = require('express-validator')

// mongoose: Used here to validate MongoDB Object IDs
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
    // If there are no validation errors, move on to the next middleware or controller logic

  next()
}

// Utility function to check if a given value is a valid MongoDB ObjectId
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)