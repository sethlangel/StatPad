import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import home from "./routes/home.js";
import users from "./routes/users.js";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", home);
app.get("/users", users);

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
