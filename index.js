const { ApolloServer } = require('apollo-server');
// const gql = require('graphql-tag');
const mongoose = require('mongoose');

// const Post = require('./models/Post'); Now we call our index.js that has all the resolvers.
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000

//const pubsub = new PubSub();

//typeDefs were originally here, now they're in their own file.
const typeDefs = require('./graphql/typeDefs');

//resolvers were originally here, now they're in their own file.


const server = new ApolloServer({
    typeDefs,
    resolvers,
    //Line Below created after Setp 28. This is so only Authenticated Users can Create Posts.
    //Line Below takes the Req Body and forward it to the Context, now we can use the Req Body in Context
    context: ({ req }) => ({ req})
    //To the line above, we LATER ON added pubsub to the context
});

mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB Connected. :D")
        return server.listen({port: PORT});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.log(err)
    })


//JIC, his steps didn't work. Sent weird error.
// So I had to npm i dotenv , THEN, create a .env file with the Cluster String.


