//Line below is to return an Auth Error
const { AuthenticationError } = require('apollo-server');

//We need the JWT and SECRET-Keys to validate and authenticate our user.
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
    //Context is an Object we're receiving from Main Index.js, in the server part.
    //It's an object and here we're accessing its headers property.
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err){
                throw new AuthenticationError('Invalid/Expired Token.');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authorization header must be provided.')
}