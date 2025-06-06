'use client'
import { useEffect, useState } from "react";
//import DatePicker from "../../components/datepicker";
import { useAuth } from "../../hooks/useAuth";
import SocialTable from "./components/SocialTable";

type Stats = {
    name: string,
    error_count: number,
    id: string
}

// function formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }

export default function Social() {
    const auth = useAuth();

    // const now = new Date();
    // const todayString = formatDate(now);

    // const lastWeek = new Date();
    // lastWeek.setDate(now.getDate() - 7);
    // const lastWeekString = formatDate(lastWeek);

    const [stats, setStats] = useState<Stats[]>([]);
    //const [startDate, setStartDate] = useState(lastWeekString);
    //const [endDate, setEndDate] = useState(todayString);

    function fetchStats() {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/ranking`);
    }

    useEffect(() => {
        const userId = auth?.session?.user?.id;
        if (!userId) return;

        fetchStats()
            .then((res) => res.json())
            .then((json) => {
                //const sorted = json.sort((a: Stats, b: Stats) => a.error_rank - b.error_rank);
                setStats(json);
            })
            .catch(console.log);
    }, [auth]);

    return (
        <div className="flex flex-col gap-3 m-5">
            {/* <div className="w-full flex justify-center gap-3 md:gap-10">
                <DatePicker date={startDate} onDateChange={(e: string) => setStartDate(e)} label="Start Date" />
                <DatePicker date={endDate} onDateChange={(e: string) => setEndDate(e)} label="End Date" />
            </div> */}

            <SocialTable data={stats} />
        </div>
    )
}
