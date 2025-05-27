import express from "express";
import { supabase } from "../supabase-client.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const uuid = req.query.uuid
    const start_date = req.query.start_date
    const end_date = req.query.end_date

    if(!uuid || !start_date || !end_date){
        return res.status(400).json({error: "Missing required query params."})
    }

    try{
        let { data, error } = await supabase.rpc('get_user_stats', {
            p_end_date: end_date, 
            p_start_date: start_date, 
            p_user_id: uuid
        })

        if(error){
            return res.status(500).json({error: "Error encountered with supabase.", details: error.message})
        }

        res.json(data)
    } catch(err){
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default router;
