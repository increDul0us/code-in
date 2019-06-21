const Movie = require('../../models/movie');
const Booking = require('../../models/booking');

module.exports = {
    bookings: async (args, req) => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id
                  };
            });
        } catch (err) {
            throw err;
        }
    },
    bookMovie: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const fetchedMovie = await Movie.findOne({
            _id: args.movieId
        });
        const booking = new Booking({
            movie: fetchedMovie
        });
        const result = await booking.save();
        return {
            ...booking._doc,
            _id: booking.id,
            movie: singleMovie.bind(this, booking._doc.movie)
        };
    }
};
