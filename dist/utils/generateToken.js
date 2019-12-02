"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signJwt = function signJwt(userId) {

  return _jsonwebtoken2.default.sign({
    userId: userId
  }, "secret", {
    expiresIn: "12h"
  });
};

exports.default = signJwt;