'use client'
import { useEffect, useState } from "react";
import DatePicker from "../../components/datepicker";

type Stats = {
    error_name: string,
    total_error_count: number
    error_rank: number
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function Stats() {
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
        fetchStats("0e16d185-e4f6-48b6-a83e-a981b0830613", startDate, endDate)
            .then((res) => res.json())
            .then((json) => {
                const sorted = json.sort((a: Stats, b: Stats) => a.error_rank - b.error_rank);
                setStats(sorted);
            })
            .catch(console.log);
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col content-center justify-center items-center gap-3 m-3">
            <div className="sm:w-full flex justify-between">
                <DatePicker date={startDate} onDateChange={(e: string) => setStartDate(e)} label="Start Date"/>
                <DatePicker date={endDate} onDateChange={(e: string) => setEndDate(e)} label="End Date"/>
            </div>
            <div>
                {
                    stats.map((stat, index) => (
                        <p key={index}>{stat.error_rank} {stat.error_name} {stat.total_error_count}</p>
                    ))
                }
            </div>
        </div>

    );
}
