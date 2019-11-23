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
  const post = await prisma.mutation.createPost(
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
    "{ id }"
  );

  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    "{ id name email posts { id title published } }"
  );

  return user;
};

createPostForUser("ck3bixyxx00xd0731g5x0pn4c", {
  title: "I like posting",
  body: "Post post post!",
  published: true
}).then(data => {
  console.log(JSON.stringify(data, undefined, 2));
});

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "My new post",
//         body: "Hi yo!",
//         published: false,
//         author: {
//           connect: {
//             id: "ck3bixyxx00xd0731g5x0pn4c"
//           }
//         }
//       }
//     },
//     "{ id title body published }"
//   )
//   .then(data => {
//     // console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.users(null, "{ id name email posts { id title } }");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost({
//     data: {
//       published: true
//     },
//     where: {
//       id: "ck3bljmci029i0731i658tuk9"
//     }
//   })
//   .then(() => {
//     return prisma.query.posts(null, "{ id title body published }");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });
