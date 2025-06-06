import express from "express";
import { AuthService } from "../services/auth-service.js";

const router = express.Router();
const authService = new AuthService();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.signUp(email, password);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.signIn(email, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ error: error.message });
  }
});

export default router;
