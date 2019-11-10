import { GraphQLServer } from "graphql-yoga";
// 5 Scalar types - String, Bool, Int, Float, ID

// Demo data

const users = [
  {
    id: 12,
    name: "Jeffrey",
    email: "owruhgf@sef.com"
  },
  {
    id: 13,
    name: "Jeff",
    email: "owfewruhgf@sef.com",
    age: 50
  },
  {
    id: 14,
    name: "Rey",
    email: "owruhgf@sef.com",
    age: 99
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users( query: String ): [User!]!
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
    users(parent, args, context, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
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
