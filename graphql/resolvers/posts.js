const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({createdAt: -1});
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_,{ postId }) {
            try{
                //These three lines were suggested in the comments as I was getting a weird error. "CastError: Cast to ObjectId failed for value"
                if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
                    throw new Error('Invalid ID');
                }
                //
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found.');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            //Line below is a lil' Sanity Check
            console.log(user);

            if(body.trim() ===''){
                throw new Error('Post Body must not be empty.')
            }

            const newPost = new Post({
                body, 
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)
            
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username){
                    await post.delete();
                    return 'Post deleted succesfully.'
                } else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch(err){
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context)

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    //Post already liked, so UNLIKE
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    //NOT Liked, SO LIKE
                    post.likes.push({
                        username, 
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found.')
        }
    }
};