const moviesResolver = require('./movies');
const authResolver = require('./auth');

const rootResolver = {
  ...moviesResolver,
  ...authResolver
};

module.exports = rootResolver;