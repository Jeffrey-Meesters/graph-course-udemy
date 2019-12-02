"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var users = [{
  id: "12",
  name: "Jeffrey",
  email: "owruhgf@sef.com"
}, {
  id: "13",
  name: "Jeff",
  email: "owfewruhgf@sef.com",
  age: 50
}, {
  id: "14",
  name: "Rey",
  email: "owruhgf@sef.com",
  age: 99
}];

var posts = [{
  id: "11",
  title: "Demo data",
  body: "Data to use demo",
  published: true,
  author: "14"
}, {
  id: "12",
  title: "I dont like this",
  body: "Because it is to repetitive",
  published: false,
  author: "14"
}, {
  id: "13",
  title: "Here is a titel",
  body: "Sexy body",
  published: true,
  author: "12"
}];

var comments = [{
  id: "2",
  text: "Hi there, nicely written!",
  author: "12",
  post: "11"
}, {
  id: "3",
  text: "Hi there, badly written!",
  author: "13",
  post: "12"
}, {
  id: "4",
  text: "Hi there, good written!",
  author: "14",
  post: "13"
}, {
  id: "5",
  text: "Hi there, oke written!",
  author: "12",
  post: "11"
}];

var db = {
  users: users,
  posts: posts,
  comments: comments
};

exports.default = db;