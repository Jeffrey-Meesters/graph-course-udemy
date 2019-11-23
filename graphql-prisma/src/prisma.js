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

prisma.query.users(null, "{ id name email }").then(data => {
  console.log(data);
});
