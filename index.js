import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import mongoose from "mongoose";
import gql from "graphql-tag";

import { config } from "./config.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers/index.js";

const port = process.env.PORT || 4000;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    introspection: process.env.NODE_ENV !== 'development',
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await mongoose.connect(config.dbUri).then(() => console.log("connected"));

  server
    .listen({ port })
    .then((res) => console.log(`server running at ${res.url}`));
};
startServer();
