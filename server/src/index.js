import path from "path";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import logConfig from "./log/log";
import fileConfig from "./config/storage";
import routeFeed from "./routes/feed";
import routerAuth from "./routes/auth";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logConfig);
app.use(express.json());
app.use(fileConfig);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", routeFeed);
app.use("/auth", routerAuth);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ac-selwmhv-shard-00-00.rlzhhgr.mongodb.net:27017,ac-selwmhv-shard-00-01.rlzhhgr.mongodb.net:27017,ac-selwmhv-shard-00-02.rlzhhgr.mongodb.net:27017/${process.env.MONGO_DATABASE}?ssl=true&replicaSet=atlas-9p4trw-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(process.env.PORT || 8080);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
