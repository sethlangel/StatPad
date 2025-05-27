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
        <div className="flex flex-col w-screen h-screen justify-center items-center gap-16">
            <h1 className="text-transparent bg-clip-text text-7xl font-extrabold bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 p-2">StatPad</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Enter your email"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Enter your password"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                </div> */}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 text-base-100 py-3 px-4 rounded-lg font-medium shadow-lg"
                >
                    Sign in
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm">
                    Don't have an account?{' '}
                    {/* TODO: LINK TO CREATE AN ACCOUNT */}
                    <a href="/login" className="text-pink-600 font-medium transition-colors">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}