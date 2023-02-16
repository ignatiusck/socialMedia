import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

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
