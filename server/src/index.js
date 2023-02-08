import path from "path";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

import routeFeed from "./routes/feed";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("src", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", routeFeed);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

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
