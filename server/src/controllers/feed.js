import post from "../models/post";

export function getPosts(req, res, next) {
  post
    .find()
    .then((result) => {
      //console.log(result);
      res.status(200).json({
        message: "post fetched",
        posts: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
