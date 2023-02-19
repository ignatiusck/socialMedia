import path from "path";

import express from "express";
import multer from "multer";

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

const app = express();

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

export default app;
