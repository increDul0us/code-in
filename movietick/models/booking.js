const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Booking = new Schema(
    {
    movie: {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Booking', Booking);