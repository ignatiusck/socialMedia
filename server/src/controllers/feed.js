import Post from "../models/post";
import { validationResult } from "express-validator";
import post from "../models/post";

export async function getPosts(req, res, next) {
  try {
    const post = await Post.find();
    //console.log(result);
    res.status(200).json({
      message: "post fetched",
      posts: post,
    });
  } catch (err) {
    if (!err.satusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function postPost(req, res, next) {
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
  try {
    const result = await post.save();
    console.log(result);
    res.status(200).json({
      message: "Post Created successfully",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getPost(req, res, next) {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("could not find post");
      err.statusCode = 422;
      throw err;
    }
    res.status(200).json({
      message: "post fetched",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function deletePost(req, res, next) {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    //console.log(post);
    if (!post) {
      const err = new Error("could not find post.");
      err.statusCode = 404;
      throw err;
    }
    await Post.findByIdAndRemove(postId);
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 422;
    }
    next(err);
  }
}
