const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Movie = new Schema({
  title: {
    type: String
    // required: true
  },
  description: {
    type: String
    // required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  price: {
    vip: Number,
    regular: Number
  },
  date: {
    type: String
    // required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Movie', Movie)
