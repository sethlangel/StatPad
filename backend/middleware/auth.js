import { supabase } from "../supabase-client.js";

const authenticateUser = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "No token provided" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the session
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token" });
    }

    console.log("Request authenticated! valid token");

    // Add the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error" });
  }
};

export default authenticateUser;
