import { body } from "express-validator";
import express from "express";

import * as routeFeed from "../controllers/feed.js";

const route = express.Router();

route.get("/posts", routeFeed.getPosts);
route.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  routeFeed.postPost
);

export default route;
