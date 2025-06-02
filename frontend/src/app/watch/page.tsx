"use client"

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/globals.css";

// Note: currently case sensitive. TODO: fix this
const ERRORS = [
    "DINK", "DRIVE", "VOLLEY", "DROP", "SERVE", "SPEED UP"
]

// Fetch today's error count
// const fetchTodaysErrorCount = async (token: string) => {
//     // Get current error count
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/stats-today`, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     });
//     const data = await response.json();

//     return data.errors || 0;
// };

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
        if (!auth.isLoggedIn()) {
            console.log("Isn't logged in");
            return;
        }

        const token = auth.session?.access_token;
        if (!token) {
            console.warn("Access token missing despite being logged in.");
            return;
        }

        // TODO: error handling
        getCurrentGame(token).then((response) => {
            setGameId(response.id);
        });

        // TODO: error handling
        // fetchTodaysErrorCount(token).then((count) => { setErrorCount(count) });

        // TODO: fix bug when game is in progress and page is refreshed. shows errors for entire day, not current game.
    }, [auth]);

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
        setErrorCount(0);
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
            setErrorCount(0);
            setShowErrorSelector(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-dark-mode] text-white px-4 py-8">
        {gameId === -1 ? (
          <button
            className="btn px-6 py-3 font-bold text-lg rounded-xl bg-[--color-pink-600] hover:bg-[--color-pink-400] transition-all shadow-lg"
            onClick={handleStartGame}>
            Start Game
          </button>
        ) : (
          <div className="w-full max-w-md bg-white text-black rounded-2xl shadow-xl p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">
                Unforced Errors
              </h1>
              <p className="text-4xl font-extrabold text-[--color-brand-gradient]">
                {errorCount}
              </p>
            </div>

            <div className="flex justify-between gap-4">
              <button
                className="flex-1 btn bg-[--color-pink-600] hover:bg-[--color-pink-400] text-white py-2 rounded-xl transition-all"
                onClick={handleLogError}>
                Error
              </button>
              <button
                className="flex-1 btn bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition-all"
                onClick={handleEndGame}>
                End Game
              </button>
            </div>

            {showErrorSelector && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Select Error Type
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {ERRORS.map((errorType) => (
                    <button
                      key={errorType}
                      className="btn py-2 px-4 rounded-xl bg-[--color-pink-200] hover:bg-[--color-pink-400] transition-all font-semibold"
                      onClick={() =>
                        handleSelectErrorType(errorType)
                      }>
                      {errorType}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
}

export default Watch;