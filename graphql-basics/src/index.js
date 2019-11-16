import { GraphQLServer } from "graphql-yoga";
import uuid from "uuid/v4";
import { addErrorLoggingToSchema } from "graphql-tools";
// 5 Scalar types - String, Bool, Int, Float, ID

// Demo data
let users = [
  {
    id: "12",
    name: "Jeffrey",
    email: "owruhgf@sef.com"
  },
  {
    id: "13",
    name: "Jeff",
    email: "owfewruhgf@sef.com",
    age: 50
  },
  {
    id: "14",
    name: "Rey",
    email: "owruhgf@sef.com",
    age: 99
  }
];

let posts = [
  {
    id: "11",
    title: "Demo data",
    body: "Data to use demo",
    published: true,
    author: "14"
  },
  {
    id: "12",
    title: "I dont like this",
    body: "Because it is to repetitive",
    published: false,
    author: "14"
  },
  {
    id: "13",
    title: "Here is a titel",
    body: "Sexy body",
    published: true,
    author: "12"
  }
];

let comments = [
  {
    id: "2",
    text: "Hi there, nicely written!",
    author: "12",
    post: "11"
  },
  {
    id: "3",
    text: "Hi there, badly written!",
    author: "13",
    post: "12"
  },
  {
    id: "4",
    text: "Hi there, good written!",
    author: "14",
    post: "13"
  },
  {
    id: "5",
    text: "Hi there, oke written!",
    author: "12",
    post: "11"
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!,
    email: String!,
    age: Int
  }
  input CreatePostInput {
    title: String!,
    body: String!,
    published: Boolean!,
    author: ID!
  }
  input CreateCommentInput {
    text: String!,
    author: ID!,
    post: ID!
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
  Mutation: {
    createUser(parent, args, context, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const newUser = {
        id: uuid(),
        ...args.data
      };

      users.push(newUser);

      return newUser;
    },
    deleteUser(parent, args, context, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (!~userIndex) {
        throw new Error("User not found");
      }

      const removedUser = users.splice(userIndex, 1);

      // filter off the post that matches the author id
      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          //  filter off the comments that matches these post
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      // Remove comments created by this user
      comments = comments.filter(comment => comment.author !== args.id);

      // removedUser is an array with 1 object
      return removedUser[0];
    },
    createPost(parent, args, context, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const newPost = {
        id: uuid(),
        ...args.data
      };

      posts.push(newPost);

      return newPost;
    },
    deletePost(parent, args, context, info) {
      const postExists = posts.some(post => post.id === args.id);

      if (!postExists) {
        throw new Error("Post not found");
      }

      let postToBeDeleted = {};
      posts = posts.filter(post => {
        if (post.id === args.id) {
          postToBeDeleted = post;
        }
        return post.id !== args.id;
      });

      comments = comments.filter(comment => comment.post !== args.id);

      return postToBeDeleted;
    },
    createComment(parent, args, context, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists && !postExists) {
        throw new Error("User and Post not found");
      }

      if (!userExists) {
        throw new Error("User not found");
      }

      if (!postExists) {
        throw new Error("Post not found");
      }

      const newComment = {
        id: uuid(),
        ...args.data
      };

      comments.push(newComment);

      return newComment;
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
