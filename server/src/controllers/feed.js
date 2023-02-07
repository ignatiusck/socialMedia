import Post from "../models/post";
import { validationResult } from "express-validator";
import post from "../models/post";

export function getPosts(req, res, next) {
  Post.find()
    .then((result) => {
      //console.log(result);
      res.status(200).json({
        message: "post fetched",
        posts: result,
      });
    })
    .catch((err) => {
      if (!err.satusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function postPost(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    throw err;
  }
  // if (!req.file) {
  //   const err = new Error("No image Provide");
  //   err.statusCode = 422;
  //   throw err;
  // }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/widya.jpg",
    creator: { name: "chandrog" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Post Created successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function getPost(req, res, next) {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("could not find post");
        err.statusCode = 422;
        throw err;
      }
      res.status(200).json({
        message: "post fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
