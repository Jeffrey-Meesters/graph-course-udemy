import "cross-fetch/polyfill";
import {
  gql
} from "apollo-boost";
import prisma from "../src/prisma";
import seedDb, {
  userOne,
  postOne,
  postTwo
} from "./utils/seedDb";
import getClient from "./utils/getClient"

const client = getClient();

beforeEach(seedDb);

test("Should expose published posts", async () => {
  const getPosts = gql `
    query {
      posts {
        title
        body
        published
      }
    }
  `;

  const resp = await client.query({
    query: getPosts
  });

  expect(resp.data.posts.length).toBe(1);
  expect(resp.data.posts[0].published).toBe(true);
})

test("Should fetch Authenticated user profile", async () => {
  const client = getClient(userOne.jwt);

  const getMyPosts = gql `
    query {
      myPosts {
        title
        body
        published
      }
    }
  `;

  const {
    data
  } = await client.query({
    query: getMyPosts
  });

  expect(data.myPosts.length).toBe(2);
});


test("should be able to update own post", async () => {
  const client = getClient(userOne.jwt);

  const updatePost = gql `
    mutation {
      updatePost(id: "${postOne.post.id}", data: {
        published: false
      }){
        id
        title
        body
        published
      }
    }
  `;

  const {
    data
  } = await client.mutate({
    mutation: updatePost
  });

  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
})

test("Should create a post", async () => {
  const client = getClient(userOne.jwt);

  const createPost = gql `
    mutation {
      createPost(data: {
        title: "new post",
        body: ""
        published: true,
      }){
        id
        title
        body
        published
      }
    }
  `;

  const {
    data
  } = await client.mutate({
    mutation: createPost
  })

  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    published: true
  });

  expect(data.createPost.title).toBe("new post");
  expect(data.createPost.body).toBe("");
  expect(data.createPost.published).toBe(true);
  expect(exists).toBe(true);
})

test('Should delete post', async () => {
  const client = getClient(userOne.jwt)
  const deletePost = gql `
      mutation {
          deletePost(
              id: "${postTwo.post.id}"
          ) {
              id
          }
      }
  `
  await client.mutate({
    mutation: deletePost
  })
  const exists = await prisma.exists.Post({
    id: postTwo.post.id
  })

  expect(exists).toBe(false)
})
