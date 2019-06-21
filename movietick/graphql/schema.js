// const {
//   buildSchema
// } = require('graphql')

// module.exports = buildSchema(`
//         type Movie{
//             _id: ID
//             title: String
//             description: String
//             imageContentType: String
//             vipPrice: Float
//             regularPrice: Float
//             date: String
//             creator: User
//         }
//         type User{
//             _id: ID
//             email: String
//             password: String
//             key: String
//             createdMovies: [Movie]
//         }
//         type Booking{
//             _id: ID
//             book: Movie
//             createdAt: String
//             updatedAt: String
//         }
//         type AuthData {
//             userId: ID!
//             email: String
//             password: String
//         }

//         input MovieInput{
//             title: String
//             description: String
//             imageContentType: String
//             vipPrice: Float
//             regularPrice: Float
//             date: String
//         }
//         input UserInput{
//             email: String
//             password: String
//             key: String
//         }

//         type RootQuery{
//             movies: [Movie]
//             login(email: String, password: String): AuthData
//             bookings: [Booking]
//         }
//         type RootMutation{
//             createMovie (movieInput: MovieInput): Movie
//             createUser (userInput: UserInput): User
//             bookMovie(movieId: ID): Booking
//         }

//         schema{
//             query: RootQuery
//             mutation: RootMutation
//         }
//     `)

const graphql = require('graphql')
const Movie = require('../models/movie')
const User = require('../models/user')
// const _ = require('lodash')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    creator: { type: UserType }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    movies: { type: MovieType }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    Movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return Movie.findById(args.id)
      }
    },
    login: {
      type: UserType,
      args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve (parent, args) {
        return User.findOne({ password: args.password, email: args.email })
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve (parent, args) {
        return Movie.find({})
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve (parent, args) {
        return User.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve (parent, args) {
        let user = new User({
          email: args.email,
          name: args.name,
          password: args.password
        })
        return user.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        creator: { type: (GraphQLObjectType) }
      },
      resolve (parent, args) {
        let movie = new Movie({
          title: args.title,
          description: args.description,
          creator: args.creator
        })
        return movie.save()
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve (parent, args) {
        return Movie.findByIdAndDelete(args.id)
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve (parent, args) {
        return Movie.findByIdAndUpdate(args.id, { $set: { title: args.title, description: args.description } }, { new: true })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
