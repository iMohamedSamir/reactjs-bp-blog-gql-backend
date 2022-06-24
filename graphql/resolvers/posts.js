import { AuthenticationError, UserInputError } from 'apollo-server';
import mongoose from 'mongoose';

import { Post } from '../../Models/Post.js'
import { checkAuth } from '../../util/check-auth.js';

export const postResolvers = {
    // Post Queries Resolver.
    Query: {
        // Post -> Fetch resolver. 
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({createdAt: -1});
                return posts;
            } catch (err) {
                throw new Error(err)
            };
        },
        // Posts -> Fetch resolver.
        getPost: async (_, {
            postId
        }) => {
            const isValidId = mongoose.Types.ObjectId.isValid(postId)
            if (isValidId) {
                try {
                    const post = await Post.findById(postId);
                    if (post) return post;
                } catch (err) {
                    throw new Error(err)
                };
            } else throw new Error('Post not found');
        }
    },
    // Post Mutations.
    Mutation: {
        // Create.
        async createPost(_, { title, body }, context) {
            const user = checkAuth(context)

            if(title.trim() === '') throw new Error('Title Can not be empty.')
            if(body.trim() === '') throw new Error('Body Can not be empty.')

            const newPost = new Post({
                title,
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            return post;
        },
        // Delete.
        async deletePost(_, {
            postId
        }, context) {
            const user = checkAuth(context);
            const isValidId = mongoose.Types.ObjectId.isValid(postId)
            if (isValidId) {
                try {
                    const post = await Post.findById(postId);
                    if (post) {
                        if (user.username === post.username) {
                            await post.delete()
                            return 'Post deleted successfully.';
                        } else throw new AuthenticationError('Action not allowed!');
                    } else throw new Error('Post not found or already been deleted');
                } catch (err) {
                    throw new Error(err)
                };
            } else throw new Error('Not valid mongodb ID');
        },
        // Post likes -> toggle resolver.
        //TODO: move it to its own document later.
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // User already Liked it, unlike it.
                    post.likes = post.likes.filter(like => like.username != username)
                } else {
                    // User is liking the post.
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