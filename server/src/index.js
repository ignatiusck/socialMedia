import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import routeFeed from "./routes/feed";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/feed", routeFeed);

mongoose
  .connect(
    "mongodb://node-complete:nodecomplete@ac-selwmhv-shard-00-00.rlzhhgr.mongodb.net:27017,ac-selwmhv-shard-00-01.rlzhhgr.mongodb.net:27017,ac-selwmhv-shard-00-02.rlzhhgr.mongodb.net:27017/message?ssl=true&replicaSet=atlas-9p4trw-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
