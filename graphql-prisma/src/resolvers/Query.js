const Query = {
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
};

export { Query as default };
