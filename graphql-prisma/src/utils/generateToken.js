import jwt from "jsonwebtoken";

const signJwt = (userId) => {

  return jwt.sign({
      userId
    },
    "secret", {
      expiresIn: "12h"
    }
  )
}

export {
  signJwt as
  default
}
