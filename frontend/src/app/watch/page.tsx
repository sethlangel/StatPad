"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/globals.css";
import { CircleX } from "lucide-react";

// Note: currently case sensitive. TODO: fix this
const ERRORS = [
  "DINK",
  "DRIVE",
  "VOLLEY",
  "DROP",
  "SERVE",
  "SPEED UP"
];

const getCurrentGame = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games/current`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error(
        "Failed to fetch game: ",
        data.error || response.statusText
      );
      return -1;
    }
  } catch (err) {
    console.error(
      "Unexpected error while fetching current game: ",
      err
    );
    return -1;
  }
};

const Watch = () => {
  const auth = useAuth();

  const [gameId, setGameId] = useState(-1);
  const [errorCount, setErrorCount] = useState(0);
  const [showErrorSelector, setShowErrorSelector] =
    useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      console.log("Isn't logged in");
      return;
    }

    const token = auth.session?.access_token;
    if (!token) {
      console.warn(
        "Access token missing despite being logged in."
      );
      return;
    }

    getCurrentGame(token)
      .then((response) => {
        if (response === -1) {
          console.warn("Failed to fetch active game.");
          return;
        } else {
          setGameId(response.id);
        }
      })
      .catch((err) => {
        console.error(
          "Unexpected error while getting current game: ",
          err
        );
      });

    // TODO: fix bug when game is in progress and page is refreshed. shows errors for entire day, not current game.
  }, [auth]);

  const handleStartGame = async () => {
    if (!auth.isLoggedIn()) {
      console.warn("User must be logged in to start a game.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.session?.access_token}`
          }
        }
      );

      if (!res.ok) {
        console.error("Failed to start game: ", res.statusText);
        return;
      }

      const data = await res.json();

      if (!data.gameId) {
        console.error("Game ID missing from response: ", data);
        return;
      }

      setGameId(data.gameId);
      setErrorCount(0);
    } catch (err) {
      console.error(
        "An unexpected error occurred while starting game: ",
        err
      );
    }
  };

  const handleEndGame = async () => {
    if (!auth.isLoggedIn() || gameId === -1) return;

    console.log(gameId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/games/${gameId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.session?.access_token}`
          }
        }
      );

      if (res.status === 200) {
        setGameId(-1);
        setErrorCount(0);
        setShowErrorSelector(false);
      } else {
        console.error("Failed to end game: ", res.statusText);
        return;
      }
    } catch (err) {
      console.error("Unexpected error ending game: ", err);
    }
  };

  // Called when user clicks "Error" button
  const handleLogError = () => setShowErrorSelector(true);

  // Called when user selects error type
  const handleSelectErrorType = async (errorType: string) => {
    setShowErrorSelector(false);

    if (!auth.isLoggedIn()) {
      console.warn("User must be logged in to log an error.");
      return;
    }

    if (!gameId || gameId === -1) {
      console.warn("Invalid game ID.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/watch/log-error`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.session?.access_token}`
          },
          body: JSON.stringify({
            errorType,
            gameId
          })
        }
      );

      if (!res.ok) {
        console.error("Failed to log error: ", res.statusText);
        return;
      }

      setErrorCount((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to log error: ", err);
    }
  };

  if (!auth.isLoggedIn()) return <div>Not logged in!</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-dark-mode] text-white px-4 py-8">
      {gameId === -1 ? (
        <button
          className="btn px-6 py-3 font-bold text-lg text-[var(--color-dark-mode)] rounded-xl bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 transition-all shadow-lg"
          onClick={handleStartGame}>
          Start Game
        </button>
      ) : (
        <div className="flex flex-col w-full max-w-md bg-transparent text-white rounded-2xl p-6 space-y-6">
          <div
            className="flex justify-end cursor-pointer"
            onClick={() => handleEndGame()}>
            <CircleX color="red" />
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setShowErrorSelector(false)}>
            <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600">
              {errorCount}
            </p>
          </div>

          {!showErrorSelector && (
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 btn font-bold text-2xl bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 text-[var(--color-dark-mode)] py-2 rounded-xl transition-all"
                onClick={handleLogError}>
                ERROR
              </button>
            </div>
          )}

          {showErrorSelector && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {ERRORS.map((errorType) => (
                  <button
                    key={errorType}
                    className="btn text-[var(--color-dark-mode)] py-2 px-4 rounded-xl bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 transition-all font-semibold"
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
};

export default Watch;
