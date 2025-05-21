'use client'

import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function Login() {
    const [responseMessage, setResponseMessage] = useState("");

    const auth = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const name = e.currentTarget.elements.namedItem("name") as HTMLInputElement; (todo)
        const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        const password = e.currentTarget.elements.namedItem("password") as HTMLInputElement;

        const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email.value,
                "password": password.value
            })
        });

        const json = await response.json();

        if (response.status === 200) {
            if (auth) {
                auth.login(json.session);
                router.push('/')
            }
            else {
                console.log("no auth");
            }
        } else if (response.status === 400) {
            setResponseMessage(json.error);
        } else {
            setResponseMessage(`An error occurred. ${response.status} - ${response.statusText}`);
        }
    }

    return (
        <div className="w-screen h-screen bg-gray-800 flex flex-row justify-center items-center" >
            <div>
                <form onSubmit={handleSubmit} >
                    <input id="email" placeholder="Email" className="bg-white" />
                    <br />
                    <input id="password" placeholder="Password" className="bg-white" />
                    <br />
                    <input type="submit" value="Log In" className="underline text-white cursor-pointer" />
                </form>
                <a href="/signup" className="underline text-white cursor-pointer">Sign Up</a>
                <br />
                <a className="text-red-500">{responseMessage}</a>
            </div>
        </div>
    );
}