import { GraphQLServer } from "graphql-yoga";
// 5 Scalar types - String, Bool, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting( name:String ): String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, context, info) {
      if (args.name) {
        return `Hello, ${args.name}`;
      } else {
        return "Hello";
      }
    },
    me() {
      return {
        id: 12,
        name: "jeffrey",
        email: "my@email.com",
        age: 30
      };
    },
    post() {
      return {
        id: 12,
        title: "My first post!",
        body: "I'm writing a post to test my graphQL queries",
        published: true
      };
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
