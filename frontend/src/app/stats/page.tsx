'use client'
import { useEffect, useState } from "react";
import DatePicker from "../../components/datepicker";
import StatsBarChart from "../../components/BarChart";
import StatsTable from "./components/StatsTable";
import { useAuth } from "../../hooks/useAuth";

type Stats = {
    error_name: string,
    total_error_count: number
    error_rank: number
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate() + 2).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function Stats() {
    const auth = useAuth();

    const now = new Date();
    const todayString = formatDate(now);

    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    const lastWeekString = formatDate(lastWeek);

    const [stats, setStats] = useState<Stats[]>([]);
    const [startDate, setStartDate] = useState(lastWeekString);
    const [endDate, setEndDate] = useState(todayString);

    function fetchStats(uuid: string, start_date: string, end_date: string) {
        return fetch(`http://localhost:8000/stats?uuid=${uuid}&start_date=${start_date}&end_date=${end_date}`);
    }

    useEffect(() => {
        const userId = auth?.session?.user?.id;
        if (!userId) return;

        fetchStats(userId, startDate, endDate)
            .then((res) => res.json())
            .then((json) => {
                const sorted = json.sort((a: Stats, b: Stats) => a.error_rank - b.error_rank);
                setStats(sorted);
            })
            .catch(console.log);
    }, [startDate, endDate, auth]);

    return (
        <div className="flex flex-col gap-3 m-5">
            <div className="w-full flex justify-center gap-3 md:gap-10">
                <DatePicker date={startDate} onDateChange={(e: string) => setStartDate(e)} label="Start Date" />
                <DatePicker date={endDate} onDateChange={(e: string) => setEndDate(e)} label="End Date" />
            </div>

            <StatsBarChart data={stats} />

            <StatsTable data={stats} />
        </div>
    )
}
