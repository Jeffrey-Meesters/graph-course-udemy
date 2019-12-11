require("babel-register");
require("@babel/polyfill/noConflict");

const server = require("../../src/server").default

module.exports = async () => {
  global.httpServer = await server.start({
      port: process.env.PORT || 4000
    },
    () => {
      console.log("Server is running", `http://localhost:${server.options.port}`);
    }
  );
}
