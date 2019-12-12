import "cross-fetch/polyfill";
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
  subscribeToPosts
} from "./utils/operations";
import prisma from "../src/prisma";
import seedDb, { userOne, postOne } from "./utils/seedDb";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDb);

test("Should expose published posts", async () => {
  const resp = await client.query({
    query: getPosts
  });

  expect(resp.data.posts.length).toBe(1);
  expect(resp.data.posts[0].published).toBe(true);
});

test("Should fetch Authenticated user profile", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({
    query: getMyPosts
  });

  expect(data.myPosts.length).toBe(1);
});

test("should be able to update own post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };

  const { data } = await client.mutate({
    mutation: updatePost,
    variables
  });

  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should create a post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      title: "new post",
      body: "",
      published: true
    }
  };

  const { data } = await client.mutate({
    mutation: createPost,
    variables
  });

  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    published: true
  });

  expect(data.createPost.title).toBe("new post");
  expect(data.createPost.body).toBe("");
  expect(data.createPost.published).toBe(true);
  expect(exists).toBe(true);
});

test("Should delete post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id
  };
  await client.mutate({
    mutation: deletePost,
    variables
  });
  const exists = await prisma.exists.Post({
    id: postOne.post.id
  });

  expect(exists).toBe(false);
});

test("Should subscribe to a post", async done => {
  client
    .subscribe({
      query: subscribeToPosts
    })
    .subscribe({
      next(resp) {
        expect(resp.data.post.mutation).toBe("DELETED");
        done();
      }
    });

  await prisma.mutation.deletePost({ where: { id: postOne.post.id } });
});
