import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: {
    name: "seed",
    email: "seed@email.com",
    password: bcrypt.hashSync("seed1234")
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: "Published post",
    body: "publishing is fun",
    published: true,
  },
  post: undefined
}
const postTwo = {
  input: {
    title: "UnPublished post",
    body: "publishing is not fun",
    published: false,
  },
  post: undefined
}

const seedDb = async () => {
  // clean test DB
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyComments();

  // seed
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({
    userId: userOne.user.id
  }, process.env.JWT_SECRET)


  // Post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  // Post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

}

export {
  seedDb as
  default, userOne, postOne, postTwo
}
