import express from "express";

import { login, register } from "../../controllers/auth";
import { validate } from "../../middlewares";
import { loginSchema, registerSchema } from "../../validations/auth";

const router = express.Router();

// Register user
router.post('/register', validate(registerSchema), register);

// Login user
router.post('/login', validate(loginSchema), login);

module.exports = router;