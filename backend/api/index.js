import express from "express";
import cors from "cors";

// routes
import home from "../routes/home.js";
import users from "../routes/users.js";
import auth from "../routes/auth.js";
import watch from "../routes/watch.js";
import stats from "../routes/stats.js";
import social from "../routes/social.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

//app.get("/", home);
app.use("/home", home);
app.use("/users", users);
app.use("/auth", auth);
app.use("/watch", watch);
app.use("/stats", stats);
app.use("/social", social);

app.listen(port, () => {
  console.log(``);
});

export default app;
