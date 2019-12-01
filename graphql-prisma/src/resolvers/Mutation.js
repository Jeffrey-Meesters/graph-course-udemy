import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import signJwt from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const verify = async (hash, password) => {
  return bcrypt.compare(password, hash);
};

const Mutation = {
  async loginUser(parent, {
    data
  }, {
    prisma
  }, info) {
    const user = prisma.query.user({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const verified = await verify(user.password, data.password);

    if (!verified) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: signJwt(user.id)
    };
  },

  async createUser(parent, args, {
    prisma
  }, info) {
    const hash = await hashPassword(args.data.password, 10);

    args.data.password = hash;

    const user = await prisma.mutation.createUser({
      data: args.data
    });

    return {
      user,
      token: signJwt(user.id)
    };
  },
  updateUser(parent, args, {
    prisma
  }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password, 10);
    }

    return prisma.mutation.updateUser({
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  deleteUser(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);
  },
  createPost(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost({
        data: {
          ...args.data,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async updatePost(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);
    const exists = prisma.exists = await prisma.exists.Post({
      where: {
        id: args.id,
        author: {
          id: userId,
        }
      }
    })

    const isPublished = prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (!exists) {
      throw new Error("Unable to update post")
    }

    if (isPublished && !args.data.published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updatePost({
        data: args.data,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deletePost(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);
    const exists = prisma.exists = await prisma.exists.Post({
      where: {
        id: args.id,
        author: {
          id: userId,
        }
      }
    })

    if (!exists) {
      throw new Error("Unable to delete post")
    }

    return prisma.mutation.deletePost({
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async createComment(parent, args, {
    prisma,
    request
  }, info) {
    const exists = await prisma.exists.post({
      id: args.data.post,
      published: true
    });

    if (!exists) {
      throw new Error("Cannot create comment")
    }

    const userId = getUserId(request);

    return prisma.mutation.createComment({
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async updateComment(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);

    const exists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      }
    })

    if (!exists) {
      throw new Error("Unable to update comment");
    }

    return prisma.mutation.updateComment({
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  async deleteComment(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request);

    const exists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      }
    })

    if (!exists) {
      throw new Error("Unable to delete comment");
    }

    return prisma.mutation.deleteComment({
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export {
  Mutation as
  default
};
