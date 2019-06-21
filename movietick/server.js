const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const cors = require('cors')

// import graphql datas
const graphQlSchema = require('./graphql/schema')
// const graphQlResolver = require('./graphql/resolver/index')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
  schema: graphQlSchema,
  //   rootValue: graphQlResolver,
  graphiql: true
}))

// Set up default mongoose connection
var mongoDB = 'mongodb://localhost/movie'
mongoose.connect(mongoDB, {
  useNewUrlParser: true
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
  console.log('connected')
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(process.env.PORT || 4000, function () {
  console.log('Server is running on Port:  %d in %s mode', this.address().port, app.settings.env)
})
