import express from "express";

const app = express();

app.use((req, res, next) => {
  res.send("hello world");
  console.log("connected");
});

app.listen(8080);
