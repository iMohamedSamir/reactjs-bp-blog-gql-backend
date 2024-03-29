import { AuthenticationError, UserInputError } from 'apollo-server';

import { Post } from '../../Models/Post.js';
import { checkAuth } from '../../util/check-auth.js';

export const commentsResolver = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context);
            if(body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment can\'t be empty.'
                    }
                });
            } 
            //TODO: add comment counter
            const post = await Post.findById(postId);
            if(post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            } else throw new UserInputError('Post not found!')
        },
        async deleteComment(_, {postId, commentId}, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId)
            if(post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                console.log(post.comments)
                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action Not allowed.', {
                    });
                }
            } else {
                throw new UserInputError('Post not found.')
            }
        }
    }
}