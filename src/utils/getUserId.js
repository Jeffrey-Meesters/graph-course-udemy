import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  let header = (request.request) ? request.request.headers.authorization : request.connection.context.Authorization;

  if (header) {
    const token = header.replace("Bearer ", '');
    console.log(process.env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }

  return null;
}

export {
  getUserId as
  default
}
