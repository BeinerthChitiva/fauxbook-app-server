//1.)
//Here FIRST we bring our Apollo Server
const { ApolloServer } = require('apollo-server');
//2.)
//SECOND, we call gql, to define our typeDefs
const gql = require('graphql-tag');

//7.)
//NOW we connect to our DB, with Mongoose.
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');

//9
const dotenv = require("dotenv");

dotenv.config();

//3.)
//Here in typeDefs we have all our Queries and say what type they return.

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`;

//4.)
// Here we have our RESOLVERS, functions that for each Query, 
// Mutation or Subscription, it has its corresponding resolver.

const resolvers = {
    Query: {
        sayHi: () => "Hello World"
    }
};

//5.)
//Now we setup the Apollo Server, it takes TWO things. TypeDefs and Resolvers
//Below is our server instance:

const server = new ApolloServer({
    typeDefs,
    resolvers
});


//6.)
//Line Below starts our server - IT'S JUST A SANITY CHECK, REPLACED LATER WITH STEP #8.

// server.listen({port: 5000})
//     .then(res => {
//         console.log(`Server running at ${res.url}`)
//     })

//8.)
//After our sanity check, we connect to our Cluster (MongoDB)

mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB Connected. :D")
        return server.listen({port: 5000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });


//JIC, his steps didn't work. Sent weird error.
// So I had to npm i dotenv , THEN, create a .env file with the Cluster String.