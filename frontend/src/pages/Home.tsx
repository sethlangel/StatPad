import { useState, useEffect } from 'react'

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

function App() {
  const [count, setCount] = useState(0)

  const [users, setUsers] = useState<User[]>([]);

  function fetchUsers() {
    return fetch("http://localhost:8000/users")
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setUsers(json))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <a href="https://react.dev" target="_blank">
          {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>{users.length > 0 && users[0].first_name} {users.length > 0 && users[0].last_name}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
