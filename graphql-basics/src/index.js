import { GraphQLServer } from "graphql-yoga";
// 5 Scalar types - String, Bool, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return "MacBook Pro";
    },
    price() {
      return 2000.99;
    },
    releaseYear() {
      return 2019;
    },
    rating() {
      return 5.0;
    },
    inStock() {
      return true;
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
