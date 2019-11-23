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

// prisma.query.users(null, "{ id name email posts { id title } }").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, "{ id text author {id name } }").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

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

prisma.mutation
  .updatePost({
    data: {
      published: true
    },
    where: {
      id: "ck3bljmci029i0731i658tuk9"
    }
  })
  .then(() => {
    return prisma.query.posts(null, "{ id title body published }");
  })
  .then(data => {
    console.log(JSON.stringify(data, undefined, 2));
  })
  .catch(error => {
    console.log(error);
  });
