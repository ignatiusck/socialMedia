import express from "express";

import * as validators from "../validator/validator";
import * as routeAuth from "../controllers/auth.js";

const router = express.Router();

router.put("/signup", validators.userInput, routeAuth.signup);
router.post("/login", routeAuth.signin);

export default router;
