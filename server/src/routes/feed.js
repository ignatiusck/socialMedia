import express from "express";

import * as validator from "../validator/validator.js";
import * as routeFeed from "../controllers/feed.js";

const route = express.Router();

route.get("/posts", routeFeed.getPosts);
route.post("/post", validator.vBody, routeFeed.postPost);
route.get("/post/:postId", routeFeed.getPost);

route.delete("/post/:postId", routeFeed.deletePost);

export default route;
