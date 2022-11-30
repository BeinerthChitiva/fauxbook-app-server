const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

//So, a POST Object has a Body, Usernama(Poster), CreatedAt(Time)
//As well as: Comments, Likes and User.
//MongoDB is Schema-Less and NoSQL, it doesn't have relations.
//But the ORM lets us have relations BETWEEN OUR MODELS.
//So that's what we're doing in the user: Part of POST.
//We're linking user to a SPECIFIC user. By havinf users as the ref,
//It allows us to automatically populate the user field if we want, using Mongoose Methods.

module.exports = model('Post', postSchema);