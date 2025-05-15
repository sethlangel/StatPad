import supabase from "../supabase-client.js";

export default async function users(req, res) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
