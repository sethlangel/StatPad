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

    return data.errors || 0;
};

const getCurrentGame = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games/current`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.status === 201) {
        return data;
    } else {
        // TODO: error checking
        return -1;
    }
}

const Watch = () => {
    const auth = useAuth();

    const [gameId, setGameId] = useState(-1);
    const [errorCount, setErrorCount] = useState(0);
    const [showErrorSelector, setShowErrorSelector] = useState(false);

    useEffect(() => {
        if (auth.isLoggedIn()) {
            const token = auth.session?.access_token!;
            // TODO: error handling
            getCurrentGame(token).then((response) => { setGameId(response.id) });
            // TODO: error handling
            fetchTodaysErrorCount(token).then((count) => { setErrorCount(count) });
        } else {
            // TODO: handle not being signed in
            console.log("Isn't logged in");
        }
    }, [auth]); // TODO: auth isn't initially instantiated? idk why. waiting for auth fixes this though

    const handleStartGame = async () => {
        if (!auth.isLoggedIn()) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`,
            }
        });

        const data = await res.json();

        // TODO: error handling

        setGameId(data.gameId);
    };

    const handleEndGame = async () => {
        if (!auth.isLoggedIn() || gameId === -1) return;

        console.log(gameId);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games/${gameId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.session?.access_token}`,
            }
        });

        if (res.status === 200) {
            setGameId(-1);
        } else {
            // TOOD: error handling
        }
    }

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
        gameId === -1 ?
            <>
                <h1>Today's Errors</h1>
                <p>{errorCount}</p>
                <button onClick={handleStartGame}>Start Game</button>
            </>
            :
            <>
                <h1>Unforced Errors</h1>
                <p>{errorCount}</p>
                <button onClick={handleLogError}>Error</button>
                <button onClick={handleEndGame}>End Game</button>
                {
                    showErrorSelector && (
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
                    )
                }
            </>
    );
}

export default Watch;