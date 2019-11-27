const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }

    // info holds the query given by the client
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      };
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    // return db.comments;
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
