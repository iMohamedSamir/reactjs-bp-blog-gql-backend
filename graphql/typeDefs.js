import gql from 'graphql-tag';

export const typeDefs = gql `
    type Post {
        id: ID!
        title: String!
        body: String!
        createdAt: String!
        lastEdit: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
    }
    type Comment {
        id: ID!
        username: String!
        body: String!
        createdAt: String!
    }
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        createdAt: String
        username: String!
        phone: String
        role: String
        isAdmin: Boolean!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        createdAt: String
        email: String!
        isAdmin: Boolean!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post!
        getUsers: [User]
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!, title: String!): Post!
        deletePost(postId: ID!): String
        createComment(postId: String!, body: String!): Comment!
        deleteComment(postId: String!, commentId: ID): Post!
        likePost(postId: ID!): Post!
        editPost(postId: ID!, title: String!, body: String!): Post
    }
`