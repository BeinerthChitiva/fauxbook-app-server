//Here we create our User Model Schema, MongoDB is Schema-Less,
//but with Mongoose we can specify a Schema to have more safety when workinig with our Server Code-

const { model, Schema } = require('mongoose');

//We could specify here that some fields are required
// but because we have GraphQL as MiddleMan, we can use it to say
// these fields are required or not.

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

//Below we export our Model and Schema

module.exports = model('User', userSchema);