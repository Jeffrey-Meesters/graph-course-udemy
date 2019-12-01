import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer");
    }

    const hash = await bcrypt.hash(data.args.password, 10);

    args.data.password = hash;

    const user = await prisma.mutation.createUser({ data: args.data });

    return {
      user,
      token: jwt.sign(
        {
          userId: user.id
        },
        "secret"
      )
    };
  },
  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  createPost(parent, args, { prisma }, info) {
    const authorId = args.data.author;
    delete args.data.author;
    return prisma.mutation.createPost(
      {
        data: {
          ...args.data,
          author: {
            connect: {
              id: authorId
            }
          }
        }
      },
      info
    );
  },
  updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost(
      {
        data: args.data,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: { id: args.id }
      },
      info
    );
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
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
  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export { Mutation as default };
