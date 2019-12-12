import "cross-fetch/polyfill";
import {
  createUser,
  getUsers,
  login,
  getProfile
} from "./utils/operations"
import prisma from "../src/prisma";
import seedDb, {
  userOne
} from "./utils/seedDb";
import getClient from "./utils/getClient"

const client = getClient();

beforeEach(seedDb);

test("Should create a new user", async () => {

  const variables = {
    data: {
      name: "Jeffrey",
      email: "jeffrey@mail.com",
      password: "12345yow"
    }
  }

  const resp = await client.mutate({
    mutation: createUser,
    variables
  });

  const exists = await prisma.exists.User({
    id: resp.data.createUser.user.id
  });

  expect(exists).toBe(true);
});

test("Should expose public author profiles", async () => {

  const resp = await client.query({
    query: getUsers
  });

  expect(resp.data.users.length).toBe(2);
  expect(resp.data.users[0].email).toBe(null);
  expect(resp.data.users[0].name).toBe("seed");
});

test("Should not login with bad credentials", async () => {

  const variables = {
    data: {
      email: "seed@email.com",
      password: "oops!"
    }
  }

  await expect(
    client.mutate({
      mutation: login,
      variables
    })
  ).rejects.toThrow();
});

test("Should not be able to sign up with a bad password", async () => {
  const variables = {
    data: {
      name: "Jeffrey2",
      email: "jeffrey2@email.com",
      password: "1234567"
    }
  }

  await expect(
    client.mutate({
      mutation: createUser,
      variables
    })
  ).rejects.toThrow();
});

test("Should fetch Authenticated user profile", async () => {
  const client = getClient(userOne.jwt)

  const {
    data
  } = await client.query({
    query: getProfile
  });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
