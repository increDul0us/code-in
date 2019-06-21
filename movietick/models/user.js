const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  addMovies: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }]
})

module.exports = mongoose.model('User', User)
