"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getUserId = require("../utils/getUserId");

var _getUserId2 = _interopRequireDefault(_getUserId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = {
  // prisma fetches relational data so no need to create this ourselves
  // But here we can restrict data responses

  email: {
    fragment: "fragment userId on User { id }",
    resolve: function resolve(parent, args, _ref, info) {
      var request = _ref.request;

      var userId = (0, _getUserId2.default)(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }

      return null;
    }
  },

  posts: {
    fragment: "fragment userId on User { id }",
    resolve: function resolve(parent, args, _ref2, info) {
      var prisma = _ref2.prisma,
          request = _ref2.request;


      return prisma.request.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      });
    }
  }
};

exports.default = User;