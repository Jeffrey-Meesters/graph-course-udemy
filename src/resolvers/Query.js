import getUserId from "../utils/getUserId"

const Query = {
  users(parent, args, {
    prisma
  }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      };
    }

    // info holds the query given by the client
    return prisma.query.users(opArgs, info);
  },

  myPosts(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    if (args.query) {
      opArgs.where.OR = [{
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ]
    };

    return prisma.query.posts(opArgs, info);
  },

  posts(parent, args, {
    prisma
  }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy,
      where: {
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [{
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ]
    };

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, {
    prisma
  }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy
    };
    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },
  async post(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if (!posts.length) {
      throw new Error("Post not found")
    }

    return posts[0];
  }
};

export {
  Query as
  default
};
