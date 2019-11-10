import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "Hello, this is not my first query!";
    },
    location() {
      return "I life in Heemskerk";
    },
    bio() {
      return "I'm a web dev for 2 years now, mainly focused on front-end and work a lot with JS";
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server is running", `http://localhost:${server.options.port}`);
});
