import { ApolloServer } from "apollo-server-micro";
import { resolvers, typeDefs } from "../../schema";

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: "/api" });
