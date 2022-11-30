const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const {SECRET_KEY} = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        {expiresIn: '7d'}
        // Line above used to be {expiresIn: '1h'} =>
        // But toISOString is WEIRD AF, it's currently: 20/11/22 - 11:50PM, but it says its 2022-11-21T04:48:49.169Z, LOL
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        //ERROR IS DEFO HERE, WITH TOKEN EXPIRY////
        ///FIX THE CREATED AT TIME, ISO BS.////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////

    );
}

module.exports = {
    Mutation: {
        async login(_, {username, password}){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors.', {errors})
            }

            const user = await User.findOne({username});

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors})
            }

            const match = await bcrypt.compare(password, user.password)
            if(!match){
                errors.general = 'Wrong credentials.';
                throw new UserInputError('Wrong credentials.', {errors})
            }

            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(
            _,
            { 
                registerInput: { username, email, password, confirmPassword}
            },
            ){
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            // Make sure User doesn't exist.
            const user = await User.findOne({ username });
            if (user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken.'
                    }
                })
            }
            // Hash password and create Auth Token
            password = await bcrypt.hash(password, 12);

            const newUser = new User ({
                email, 
                username, 
                password, 
                createdAt: new Date().toDateString()
            });

            const res = await newUser.save();

            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}