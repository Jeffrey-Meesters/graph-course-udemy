import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { deleteComment, subscribeToComments } from "./utils/operations";
import seedDb, { userOne, userTwo, commentOne, postOne } from "./utils/seedDb";
import getClient from "./utils/getClient";

beforeEach(seedDb);
const client = getClient();
test("Should delete own comment", async () => {
  const client = getClient(userTwo.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  await client.mutate({
    mutation: deleteComment,
    variables
  });

  const exists = await prisma.exists.Comment({
    id: commentOne.comment.id
  });

  expect(exists).toBe(false);
});

test("Should not delete other users' comment", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  await expect(
    client.mutate({
      mutation: deleteComment,
      variables
    })
  ).rejects.toThrow();
});

test("Should subscribe to comments for a post", async done => {
  const variables = {
    postId: postOne.post.id
  };

  client
    .subscribe({
      query: subscribeToComments,
      variables
    })
    .subscribe({
      next(resp) {
        expect(resp.data.comment.mutation).toBe("DELETED");
        done();
      }
    });

  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});
