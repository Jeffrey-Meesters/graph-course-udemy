"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _getUserId = require("../utils/getUserId");

var _getUserId2 = _interopRequireDefault(_getUserId);

var _generateToken = require("../utils/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _hashPassword = require("../utils/hashPassword");

var _hashPassword2 = _interopRequireDefault(_hashPassword);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var verify = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(hash, password) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", _bcryptjs2.default.compare(password, hash));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function verify(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var Mutation = {
  loginUser: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, _ref2, _ref3, info) {
      var data = _ref2.data;
      var prisma = _ref3.prisma;
      var user, verified;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              user = prisma.query.user({
                where: {
                  email: data.email
                }
              });

              if (user) {
                _context2.next = 3;
                break;
              }

              throw new Error("User not found");

            case 3:
              _context2.next = 5;
              return verify(user.password, data.password);

            case 5:
              verified = _context2.sent;

              if (verified) {
                _context2.next = 8;
                break;
              }

              throw new Error("Unable to login");

            case 8:
              return _context2.abrupt("return", {
                user: user,
                token: (0, _generateToken2.default)(user.id)
              });

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function loginUser(_x3, _x4, _x5, _x6) {
      return _ref4.apply(this, arguments);
    }

    return loginUser;
  }(),
  createUser: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
      var prisma = _ref5.prisma;
      var hash, user;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _hashPassword2.default)(args.data.password, 10);

            case 2:
              hash = _context3.sent;


              args.data.password = hash;

              _context3.next = 6;
              return prisma.mutation.createUser({
                data: args.data
              });

            case 6:
              user = _context3.sent;
              return _context3.abrupt("return", {
                user: user,
                token: (0, _generateToken2.default)(user.id)
              });

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function createUser(_x7, _x8, _x9, _x10) {
      return _ref6.apply(this, arguments);
    }

    return createUser;
  }(),
  updateUser: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
      var prisma = _ref7.prisma;
      var userId;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = (0, _getUserId2.default)(request);

              if (!(typeof args.data.password === 'string')) {
                _context4.next = 5;
                break;
              }

              _context4.next = 4;
              return (0, _hashPassword2.default)(args.data.password, 10);

            case 4:
              args.data.password = _context4.sent;

            case 5:
              return _context4.abrupt("return", prisma.mutation.updateUser({
                where: {
                  id: userId
                },
                data: args.data
              }, info));

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function updateUser(_x11, _x12, _x13, _x14) {
      return _ref8.apply(this, arguments);
    }

    return updateUser;
  }(),
  deleteUser: function deleteUser(parent, args, _ref9, info) {
    var prisma = _ref9.prisma,
        request = _ref9.request;

    var userId = (0, _getUserId2.default)(request);
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);
  },
  createPost: function createPost(parent, args, _ref10, info) {
    var prisma = _ref10.prisma,
        request = _ref10.request;

    var userId = (0, _getUserId2.default)(request);

    return prisma.mutation.createPost({
      data: _extends({}, args.data, {
        author: {
          connect: {
            id: userId
          }
        }
      })
    }, info);
  },
  updatePost: function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref11, info) {
      var prisma = _ref11.prisma,
          request = _ref11.request;
      var userId, exists, isPublished;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              userId = (0, _getUserId2.default)(request);
              _context5.next = 3;
              return prisma.exists.Post({
                where: {
                  id: args.id,
                  author: {
                    id: userId
                  }
                }
              });

            case 3:
              exists = prisma.exists = _context5.sent;
              isPublished = prisma.exists.Post({
                id: args.id,
                published: true
              });

              if (exists) {
                _context5.next = 7;
                break;
              }

              throw new Error("Unable to update post");

            case 7:
              if (!(isPublished && !args.data.published)) {
                _context5.next = 10;
                break;
              }

              _context5.next = 10;
              return prisma.mutation.deleteManyComments({
                where: {
                  post: {
                    id: args.id
                  }
                }
              });

            case 10:
              return _context5.abrupt("return", prisma.mutation.updatePost({
                data: args.data,
                where: {
                  id: args.id
                }
              }, info));

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function updatePost(_x15, _x16, _x17, _x18) {
      return _ref12.apply(this, arguments);
    }

    return updatePost;
  }(),
  deletePost: function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, args, _ref13, info) {
      var prisma = _ref13.prisma,
          request = _ref13.request;
      var userId, exists;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              userId = (0, _getUserId2.default)(request);
              _context6.next = 3;
              return prisma.exists.Post({
                where: {
                  id: args.id,
                  author: {
                    id: userId
                  }
                }
              });

            case 3:
              exists = prisma.exists = _context6.sent;

              if (exists) {
                _context6.next = 6;
                break;
              }

              throw new Error("Unable to delete post");

            case 6:
              return _context6.abrupt("return", prisma.mutation.deletePost({
                where: {
                  id: args.id
                }
              }, info));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function deletePost(_x19, _x20, _x21, _x22) {
      return _ref14.apply(this, arguments);
    }

    return deletePost;
  }(),
  createComment: function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parent, args, _ref15, info) {
      var prisma = _ref15.prisma,
          request = _ref15.request;
      var exists, userId;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return prisma.exists.post({
                id: args.data.post,
                published: true
              });

            case 2:
              exists = _context7.sent;

              if (exists) {
                _context7.next = 5;
                break;
              }

              throw new Error("Cannot create comment");

            case 5:
              userId = (0, _getUserId2.default)(request);
              return _context7.abrupt("return", prisma.mutation.createComment({
                data: {
                  text: args.data.text,
                  author: {
                    connect: {
                      id: userId
                    }
                  },
                  post: {
                    connect: {
                      id: args.data.post
                    }
                  }
                }
              }, info));

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function createComment(_x23, _x24, _x25, _x26) {
      return _ref16.apply(this, arguments);
    }

    return createComment;
  }(),
  updateComment: function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, args, _ref17, info) {
      var prisma = _ref17.prisma,
          request = _ref17.request;
      var userId, exists;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              userId = (0, _getUserId2.default)(request);
              _context8.next = 3;
              return prisma.exists.Comment({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 3:
              exists = _context8.sent;

              if (exists) {
                _context8.next = 6;
                break;
              }

              throw new Error("Unable to update comment");

            case 6:
              return _context8.abrupt("return", prisma.mutation.updateComment({
                where: {
                  id: args.id
                },
                data: args.data
              }, info));

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function updateComment(_x27, _x28, _x29, _x30) {
      return _ref18.apply(this, arguments);
    }

    return updateComment;
  }(),
  deleteComment: function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(parent, args, _ref19, info) {
      var prisma = _ref19.prisma,
          request = _ref19.request;
      var userId, exists;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              userId = (0, _getUserId2.default)(request);
              _context9.next = 3;
              return prisma.exists.Comment({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 3:
              exists = _context9.sent;

              if (exists) {
                _context9.next = 6;
                break;
              }

              throw new Error("Unable to delete comment");

            case 6:
              return _context9.abrupt("return", prisma.mutation.deleteComment({
                where: {
                  id: args.id
                }
              }, info));

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function deleteComment(_x31, _x32, _x33, _x34) {
      return _ref20.apply(this, arguments);
    }

    return deleteComment;
  }()
};

exports.default = Mutation;