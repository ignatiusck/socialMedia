import express from "express";

import * as routeFeed from "../controllers/feed.js";

const route = express.Router();

route.get("/posts", routeFeed.getPosts);

export default route;
