import uuid from "uuid/v4";

const Mutation = {
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
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);

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
    }

    return post;
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

    pubsub.publish(`comment_${args.data.post}`, { comment: newComment });

    return newComment;
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    return comment;
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
};

export { Mutation as default };
