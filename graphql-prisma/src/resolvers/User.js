import getUserId from "../utils/getUserId"

const User = {
  // prisma fetches relational data so no need to create this ourselves
  // But here we can restrict data responses

  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, {
      request
    }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }

      return null;
    }
  },

  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, {
      prisma,
      request
    }, info) {

      return prisma.request.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  }
};

export {
  User as
  default
};
