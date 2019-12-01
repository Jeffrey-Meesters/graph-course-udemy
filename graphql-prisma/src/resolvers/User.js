import getUserId from "../utils/getUserId"

const User = {
  // prisma fetches relational data so no need to create this ourselves
  // But here we can restrict data responses

  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, {
      request
    }, info) {
      const userId = getd(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }

      return null;
    }
  }
};

export {
  User as
  default
};
