import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";

export async function signup(req, res, next) {
  const error = validationResult(req);
  try {
    if (!error.isEmpty()) {
      const err = new Error("Validation Failed.");
      err.statusCode = 422;
      err.data = error.array();
      throw err;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(12);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      name: name,
      password: hashedPass,
    });
    await user.save();
    res.status(200).json({ message: "User created", userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function signin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("Email not found!.");
      err.statusCode = 401;
      throw err;
    }
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Password wrong!.");
      err.statusCode = 500;
      throw err;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "supersecreat",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
}
