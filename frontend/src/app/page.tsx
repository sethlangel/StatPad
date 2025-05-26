'use client'
import { useAuth } from "../hooks/useAuth"

export default function Page() {
    const auth = useAuth();

    return (
        <>
            <h1>Hello, Next.js!</h1>
            <h1>Signed in? {auth?.isLoggedIn() ? "yes" : "no"}</h1>
            {auth?.isLoggedIn() ? <>
                <a>{JSON.stringify(auth.session!)}</a>
                <br />
                <button className="bg-amber-950 p-3 text-white rounded-2xl cursor-pointer" onClick={auth?.logout}>Sign out</button>
            </> :
                <a className="underline cursor-pointer" href="/login">Go to login</a>
            }
        </>
    );
}