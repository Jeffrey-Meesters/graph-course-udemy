import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: ""
});

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

const createPostForUser = async (authorId, data) => {
  const exists = await prisma.exists.User({ id: authorId });

  if (!exists) {
    throw new Error("User not found");
  }

  const postData = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{ author { id name email posts { id title published } } }"
  );

  return postData;
};

// createPostForUser("ck3bixyxx00xd0731g5x0pn4c", {
//   title: "I Like To Write",
//   body: "BODY",
//   published: false
// })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch(error => {
//     console.log(error);
//   });

const updatePosteForUser = async (postId, data) => {
  const exists = await prisma.exists.Post({ id: postId });

  if (!exists) {
    throw new Error("Post not found");
  }

  const postData = await prisma.mutation.updatePost(
    {
      data,
      where: {
        id: postId
      }
    },
    "{ author { id name email posts { id title published } } }"
  );

  return postData;
};
