const Movie = require('../../models/movie');
const User = require('../../models/user');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AQKS_YPwu3_I4v2psC4h0eqUfRtHsxTxYhIuNe1fqdLo1T_LJhmN5iWNkioMDEc5ThC9roLvypowRfJD',
    'client_secret': 'EAlOK8JUZJnIdY-RvmdoUf70FnO0SRUCxUVNZpwI1bkORGXAY5N5qGkR9Hkg0u5sfgJkSthtqz0Bqoki'
  });

module.exports = {
    movies: async () => {
        try {
            const movies = await Movie.find();
            return movies.map(movie => {
                return {
                    ...movie._doc,
                    _id: movie.id
                    // creator: user.bind(this, movie.creator)
                }
            });
        } catch (err) {
            throw err;
        }
    },
    createMovie: async (args, req) => {
        const movie = new Movie({
            title: args.movieInput.title,
            description: args.movieInput.description,
            price: {
                vip: args.movieInput.price,
                regular: args.movieInput.price,
            },
            date: args.movieInput.date,
            creator: req.userId
        });
        let createdMovie;
        try {
            const result = await movie.save();
            createdMovie =  {
                ...result._doc,
                _id: result.id,
                // creator: user.bind(this, result.creator)
              };
            // const creator = await User.findById(req.userId);

            // if (!creator) {
            //     throw new Error('User not found.');
            // }
            // creator.createdMovies.push(movie);
            // await creator.save();

            return createdMovie;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookMovie: async (args, req) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:4000/graphql/success",
                "cancel_url": "http://localhost:4000/graphql/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Movie",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "A movie"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0;i < payment.links.length;i++){
                  if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                  }
                }
            }
        });
    }
};
