import { GraphQLServer } from "graphql-yoga";
import uuid from "uuid/v4";
import db from "./db";

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }

      return db.users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }

      return db.posts.filter(post => {
        return (
          post.title
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase()) ||
          post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        );
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments;
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
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const newUser = {
        id: uuid(),
        ...args.data
      };

      db.users.push(newUser);

      return newUser;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (!~userIndex) {
        throw new Error("User not found");
      }

      const removedUser = db.users.splice(userIndex, 1);

      // filter off the post that matches the author id
      db.posts = db.posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          //  filter off the comments that matches these post
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      // Remove comments created by this user
      db.comments = db.comments.filter(comment => comment.author !== args.id);

      // removedUser is an array with 1 object
      return removedUser[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const newPost = {
        id: uuid(),
        ...args.data
      };

      db.posts.push(newPost);

      return newPost;
    },
    deletePost(parent, args, { db }, info) {
      const postExists = db.posts.some(post => post.id === args.id);

      if (!postExists) {
        throw new Error("Post not found");
      }

      let postToBeDeleted = {};
      db.posts = db.posts.filter(post => {
        if (post.id === args.id) {
          postToBeDeleted = post;
        }
        return post.id !== args.id;
      });

      db.comments = db.comments.filter(comment => comment.post !== args.id);

      return postToBeDeleted;
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      const postExists = db.posts.some(
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

      db.comments.push(newComment);

      return newComment;
    },
    deleteComment(parent, args, { db }, info) {
      const indexOfComment = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (!~indexOfComment) {
        throw new Error("Comment not found");
      }

      const removedComment = db.comments.splice(indexOfComment, 1);

      return removedComment[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("Server is running", `http://localhost:${server.options.port}`);
});
