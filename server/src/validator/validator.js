import { body } from "express-validator";

import User from "../models/user";

export const postInput = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

export const userInput = [
  body("email")
    .isEmail()
    .withMessage("Please enter the valid email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists");
        }
      });
    })
    .normalizeEmail(),
  body("name").trim().not().isEmpty(),
  body("password").trim().isLength({ min: 5 }),
];

export const statusInput = [body("status").trim().not().isEmpty()];
