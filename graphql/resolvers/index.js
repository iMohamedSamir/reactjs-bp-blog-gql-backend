import { postResolvers } from './posts.js';
import { userResolvers } from './users.js'
import { commentsResolver } from './comments.js'
export const resolvers = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolver.Mutation
    }
}