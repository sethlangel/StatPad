import { useState, useEffect } from "react";
import { supabase } from "../../../../backend/supabase-client.js";
import { User } from "@supabase/supabase-js"

// Fetch today's error count
const fetchTodaysErrorCount = async (userId: string) => {
  const res = await fetch(`/watch/stats-today?userId=${userId}`);
  const data = await res.json();

  console.log("data in fetchTodaysErrorCount = ", data);
  return (data.errors || []).length;
};

const Watch = () => {
  
  const [user, setUser] = useState<User | null>(null);

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
    supabase.auth.getUser().then(({ data }) => {
        console.log("data = ", data);

        if (data && data.user) {
            setUser(data.user);
            fetchTodaysErrorCount(data.user.id).then(setErrorCount);
        }
        else {
            window.location.href = "/login";
        }
    });
  }, []);

  // Called when user clicks "Start Game"
  const handleStartGame = async () => {
    if (!user) return;

    const res = await fetch(`/watch/new-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
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

    if (!user || !gameId) return;

    await fetch("/watch/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errorType,
        gameId,
        userId: user.id
      })
    });

    setErrorCount((prev) => prev + 1);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

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
                {["Dink", "Smash", "Volley"].map(
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
