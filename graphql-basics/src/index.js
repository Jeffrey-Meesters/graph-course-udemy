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

const comments = [
  {
    id: 2,
    text: "Hi there, nicely written!",
    author: 12,
    post: 11
  },
  {
    id: 3,
    text: "Hi there, badly written!",
    author: 13,
    post: 12
  },
  {
    id: 4,
    text: "Hi there, good written!",
    author: 14,
    post: 13
  },
  {
    id: 5,
    text: "Hi there, oke written!",
    author: 12,
    post: 11
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users( query: String ): [User!]!
    posts( query: String ): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent, args, context, info) {
      return comments;
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
    },
    comments(parent, args, context, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, context, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, context, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, context, info) {
      return posts.find(post => {
        return post.id === parent.post;
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
