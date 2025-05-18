import express from "express";
import supabase from "../supabase-client.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { data, error } =
      await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// Get current user's profile
router.get("/me", authenticateUser, async (req, res) => {
  try {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      user_metadata: req.user.user_metadata,
      app_metadata: req.user.app_metadata,
      created_at: req.user.created_at
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

export default router;
