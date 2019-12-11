import "cross-fetch/polyfill";
import {
  gql
} from "apollo-boost";
import prisma from "../src/prisma";
import seedDb, {
  userOne
} from "./utils/seedDb";
import getClient from "./utils/getClient"

const client = getClient();

beforeEach(seedDb);

test("Should create a new user", async () => {
  const createUser = gql `
    mutation {
      createUser(
        data: {
          name: "Jeffrey"
          email: "jeffrey@email.com"
          password: "pass1234"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const resp = await client.mutate({
    mutation: createUser
  });

  const exists = await prisma.exists.User({
    id: resp.data.createUser.user.id
  });

  expect(exists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const getUsers = gql `
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const resp = await client.query({
    query: getUsers
  });

  expect(resp.data.users.length).toBe(1);
  expect(resp.data.users[0].email).toBe(null);
  expect(resp.data.users[0].name).toBe("seed");
});

test("Should not login with bad credentials", async () => {
  const login = gql `
    mutation {
      loginUser(data: { email: "seed@email.com", password: "oops!" }) {
        token
      }
    }
  `;

  await expect(
    client.mutate({
      mutation: login
    })
  ).rejects.toThrow();
});

test("Should not be able to sign up with a bad password", async () => {
  const createUser = gql `
    mutation {
      createUser(
        data: {
          name: "Jeffrey2"
          email: "jeffrey2@email.com"
          password: "1234567"
        }
      ) {
        token
      }
    }
  `;

  await expect(
    client.mutate({
      mutation: createUser
    })
  ).rejects.toThrow();
});

test("Should fetch Authenticated user profile", async () => {
  const client = getClient(userOne.jwt)

  const getProfile = gql `
    query {
      me {
        id
        name
        email
      }
    }
  `;

  const {
    data
  } = await client.query({
    query: getProfile
  });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
