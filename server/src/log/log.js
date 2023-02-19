import fs from "fs";

import express from "express";
import morgan from "morgan";
import path from "path";

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();

app.use(morgan("combined", { stream: accessLogStream }));

export default app;
