import uuid from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }

    return prisma.mutation.createUser({ data: args.data }, info);
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("Usr not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email not available");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  async deleteUser(parent, args, { prisma }, info) {
    const exists = await prisma.exists.User({ id: args.id });

    if (!exists) {
      throw new Error("User not found");
    }

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = {
      id: uuid(),
      ...args.data
    };

    db.posts.push(newPost);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: newPost
        }
      });
    }

    return newPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };
    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted event
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // created event
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      // updated event
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
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

    if (postToBeDeleted.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: postToBeDeleted
        }
      });
    }

    return postToBeDeleted;
  },
  createComment(parent, args, { db, pubsub }, info) {
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

    pubsub.publish(`comment_${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: newComment
      }
    });

    return newComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment_${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const indexOfComment = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (!~indexOfComment) {
      throw new Error("Comment not found");
    }

    const removedComment = db.comments.splice(indexOfComment, 1);

    pubsub.publish(`comment_${removedComment[0].post}`, {
      comment: {
        mutation: "DELETED",
        data: removedComment[0]
      }
    });

    return removedComment[0];
  }
};

export { Mutation as default };
