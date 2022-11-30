const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    // Line Below is our Post Modifier, each time there's a change in anything that returns a Post, it comes here to the Modifier.
    Post: {
        likeCount(parent){
            console.log(parent)
            return parent.likes.length
        },
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
};