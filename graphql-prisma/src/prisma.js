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

prisma.query.users(null, "{ id name email posts { id title } }").then(data => {
  console.log(JSON.stringify(data, undefined, 2));
});
