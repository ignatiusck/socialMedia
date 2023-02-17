import express from "express";

import isAuth from "../authenticator/isAuth.js";
import * as validator from "../validator/validator.js";
import * as routeFeed from "../controllers/feed.js";

const route = express.Router();

route.get("/posts", isAuth, routeFeed.getPosts);
route.post("/post", isAuth, validator.postInput, routeFeed.postPost);
route.get("/post/:postId", isAuth, routeFeed.getPost);
route.put("/post/:postId", isAuth, validator.postInput, routeFeed.updatePost);
route.delete("/post/:postId", isAuth, routeFeed.deletePost);

export default route;
