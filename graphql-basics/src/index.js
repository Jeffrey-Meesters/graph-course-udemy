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

const posts = [
  {
    id: 11,
    title: "Demo data",
    body: "Data to use demo",
    published: true,
    author: 14
  },
  {
    id: 12,
    title: "I dont like this",
    body: "Because it is to repetitive",
    published: false,
    author: 14
  },
  {
    id: 13,
    title: "Here is a titel",
    body: "Sexy body",
    published: true,
    author: 12
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users( query: String ): [User!]!
    posts( query: String ): [Post!]!
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
    author: User!
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
    posts(parent, args, context, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        return (
          post.title
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase()) ||
          post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        );
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
  },
  Post: {
    author(parent, args, context, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
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
