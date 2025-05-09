import {createClient} from "@supabase/supabase-js"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const app = express();
const port = 8000;
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
  
app.get("/users", (req, res) => {
const name = req.query.name;
const job = req.query.job;

userService.getUsers(name, job).then((r) => res.send(r))
.catch((err) => console.log(err))});  

app.get('/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
})

export default router;