"use client"

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

// Note: currently case sensitive. TODO: fix this
const ERRORS = [
    "DINK", "DRIVE", "VOLLEY", "DROP", "SERVE", "SPEED UP"
]

// Fetch today's error count
const fetchTodaysErrorCount = async (token: string) => {
    // Get current error count
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/stats-today`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();

    return data.errors || null;
};

const Watch = () => {
    const auth = useAuth();
    if (!auth) return;

    const [gameId, setGameId] = useState<number | null>(null);

    // Track whether a game has started
    const [gameStarted, setGameStarted] = useState(false);

    // Store current game's error count
    const [errorCount, setErrorCount] = useState(0);

    // State to toggle the error type selector popup
    const [showErrorSelector, setShowErrorSelector] = useState(false);

    // On first render:
    // 1. check for auth on mount
    // 2. fetch today's error count
    useEffect(() => {
        if (auth.isLoggedIn()) {
            console.log("Is logged in");
            fetchTodaysErrorCount(auth.session?.access_token!).then((count) => { if (count) setErrorCount(count); else setErrorCount(0); });
        } else {
            // TODO: handle not being signed in
            console.log("Isn't logged in");
        }
    }, [auth]); // TODO: auth isn't initially instantiated? idk why. waiting for auth fixes this though

    // Called when user clicks "Start Game"
    const handleStartGame = async () => {
        if (!auth.isLoggedIn()) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/new-game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`,
            }
        });

        const data = await res.json();
        console.log("data = ", data);
        setGameId(data.gameId);
        setGameStarted(true);
    };

    // Called when user clicks "Error" button
    const handleLogError = () => setShowErrorSelector(true);

    // Called when user selects error type
    const handleSelectErrorType = async (errorType: string) => {
        setShowErrorSelector(false);

        if (!auth.isLoggedIn() || !gameId) return;

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/log-error`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`
            },
            body: JSON.stringify({
                errorType,
                gameId,
            })
        });
        // todo: only increase on success
        setErrorCount((prev) => prev + 1);
    };

    if (!auth.isLoggedIn())
        return <div>Not logged in!</div>;

    return (
        <div>
            {!gameStarted ? (
                <>
                    <h1>Today's Errors</h1>
                    <p>{errorCount}</p>
                    <button onClick={handleStartGame}>Start Game</button>
                </>
            ) : (
                <>
                    <h1>Unforced Errors</h1>
                    <p>{errorCount}</p>
                    <button onClick={handleLogError}>Error</button>

                    {showErrorSelector && (
                        <div>
                            <h2>Select Error Type</h2>
                            <div>
                                {ERRORS.map(
                                    (errorType) => (
                                        <button
                                            key={errorType}
                                            onClick={() =>
                                                handleSelectErrorType(errorType)
                                            }>
                                            {errorType}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Watch;