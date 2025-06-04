"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Trophy, CircleAlert, Clock, ChartColumn } from "lucide-react";
import InfoBox, { Data } from "./components/InfoBox";

export default function Home() {
    const auth = useAuth();

    const [weeklyStats, setWeeklyStats] = useState({
        game_count: 0,
        error_count: 0,
        total_time: 0,
        time_unit: "ms"
    });

    const [socialStats, setSocialStats] = useState({
        total_matches_played: 0,
        total_errors_made: 0,
        total_time: 0,
        time_unit: "ms",
        errors_per_game: 0,
    });

    function fetchWeeklyStats() {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home/weekly`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`
            }
        });
    }

    function fetchSocialStats() {
        console.log('here');
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home/social`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`
            }
        });
    }

    useEffect(() => {
        fetchWeeklyStats()
            .then((res) => res.json())
            .then((json) => {
                const minutes = json.total_time / 1000 / 60;

                // Convert time to minutes
                if (minutes <= 60) {
                    json.total_time = minutes;
                    json.time_unit = "minutes";
                } else {
                    // Or convert to hours if >1 hour played
                    json.total_time = minutes / 60;
                    json.time_unit = "hours";
                }

                setWeeklyStats(json);
            })
            .catch((error) => console.log("fetchWeeklyStats() error:", error));

        fetchSocialStats()
            .then((res) => res.json())
            .then((json) => {
                const minutes = json.total_time / 1000 / 60;

                // Convert time to minutes
                if (minutes <= 60) {
                    json.total_time = minutes;
                    json.time_unit = "minutes";
                } else {
                    // Or convert to hours if >1 hour played
                    json.total_time = minutes / 60;
                    json.time_unit = "hours";
                }

                setSocialStats(json);
            })
            .catch((error) => console.log("fetchSocialStats() error:", error));
    }, [auth]);

    const weekly: Data[] = [
        {
            icon: Trophy,
            mainText: weeklyStats.game_count,
            bottomText: "Matches Played",
        },
        {
            icon: CircleAlert,
            mainText: weeklyStats.error_count,
            bottomText: "Errors Made"
        },
        {
            icon: Clock,
            mainText: `${weeklyStats.total_time.toFixed(1)} ${weeklyStats.time_unit}`,
            bottomText: "Time Played"
        },
        {
            icon: ChartColumn,
            mainText: (weeklyStats.error_count / weeklyStats.game_count).toFixed(2),
            bottomText: "Errors Per Game"
        },
    ]

    const social: Data[] = [
        {
            icon: Trophy,
            mainText: socialStats.total_matches_played,
            bottomText: "Matches Played",
        },
        {
            icon: CircleAlert,
            mainText: socialStats.total_errors_made,
            bottomText: "Errors Made"
        },
        {
            icon: Clock,
            mainText: `${socialStats.total_time.toFixed(1)} ${socialStats.time_unit}`,
            bottomText: "Time Played"
        },
        {
            icon: ChartColumn,
            mainText: socialStats.errors_per_game,
            bottomText: "Errors Per Game"
        },
    ]

    return (
        <>
            <div className="w-full">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="my-10 md:mt-20">
                        <div className="text-xl text-center text-pink-200">
                            Welcome back
                        </div>

                        <div className="text-xl text-center text-pink-200">
                            {auth.session?.user.email}!
                        </div>
                    </div>


                    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                        <InfoBox title="Weekly Overview" href="/stats" data={weekly} />
                        <InfoBox title="Social Overview" href="/social" data={social} />
                    </div>
                </div>
            </div>
        </>
    )
}