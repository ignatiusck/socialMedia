import fs from "fs";

import Post from "../models/post";
import User from "../models/user";
import { validationResult } from "express-validator";

export async function getPosts(req, res, next) {
  const currentPage = req.query.page || 1;
  const perPage = 3;
  try {
    const totalItem = await Post.find().countDocuments();
    const post = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    //console.log(post);
    res.status(200).json({
      message: "post fetched",
      posts: post,
      totalItems: totalItem,
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
  if (!err.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    throw err;
  }
  if (!req.file) {
    const err = new Error("No image Provide");
    err.statusCode = 422;
    throw err;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  console.log(content);
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    const result = await post.save();
    const user = await User.findById(req.userId);
    user.post.push(result);
    await user.save();
    res.status(200).json({
      message: "Post Created successfully",
      post: result,
      creator: {
        _id: user._id,
        name: user.name,
      },
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
    if (post.creator.toString() !== req.userId) {
      const err = new Error("not authorized!.");
      err.statusCode = 403;
      console.log("otw throw");
      throw err;
    }
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.post.pull(postId);
    await user.save();
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 422;
    }
    next(err);
  }
}

export async function updatePost(req, res, next) {
  const postId = req.params.postId;
  const error = validationResult(req);
  try {
    if (!error.isEmpty()) {
      const err = new Error("Validation error, entered data is incorrect");
      err.statusCode = 422;
      throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const err = new Error("No file picked");
      err.statusCode = 422;
      throw err;
    }
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Could not find error");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator.toString() !== req.userId) {
      const err = new Error("not authorized!.");
      err.statusCode = 403;
      console.log("otw throw");
      throw err;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    await post.save();
    res.status(200).json({ message: "post updated", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422;
      console.log("otw next");
    }
    next(err);
  }
}

export async function getStatus(req, res, next) {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("user not found");
      err.statusCode = 403;
      throw err;
    }
    const status = user.status;
    res.status(200).json({
      message: "status fetched",
      status: status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function postStatus(req, res, next) {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("user not found");
      err.statusCode = 403;
      throw err;
    }
    const status = req.body.status;
    user.status = status;
    await user.save();
    res.status(200).json({
      message: "status updated.",
      status: status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
