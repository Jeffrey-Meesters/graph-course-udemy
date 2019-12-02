import jwt from "jsonwebtoken";

const signJwt = (userId) => {

  return jwt.sign({
      userId
    },
    process.env.JWT_SECRET, {
      expiresIn: "12h"
    }
  )
}

export {
  signJwt as
  default
}
