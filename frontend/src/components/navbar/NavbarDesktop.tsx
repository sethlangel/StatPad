'use client'
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"

export default function Navbar({ children }: { children: React.ReactNode }) {
    const auth = useAuth()
    const router = useRouter()

    return (
        <>
                <div className="navbar bg-base-300 shadow-sm sticky top-0 z-50">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="url(#gradient)">
                                    <defs>
                                        <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="0%" stopColor="#F3E3F9" />
                                            <stop offset="50%" stopColor="#E1C6F2" />
                                            <stop offset="100%" stopColor="#D1A7F2" />
                                        </linearGradient>
                                    </defs>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a href="/">Home</a></li>
                                <li><a href="/stats">Stats</a></li>
                                <li><a href="/social">Social</a></li>
                                <li><a href="/watch">Watch</a></li>
                                <li><div onClick={() => {
                                    auth.logout()
                                    router.push("/login")
                                }}>Logout</div></li>
                            </ul>
                        </div>
                    </div>
                    <div className="navbar-center">
                        <a href="/" className="btn btn-ghost text-transparent bg-clip-text text-2xl font-extrabold bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 p-2">StatPad</a>
                    </div>
                    <div className="navbar-end mr-3">
                        <div className='text-pink-400'>{auth.session?.user.email}</div>
                    </div>

                </div >
                <div>
                    {children}
                </div>
            </>
    )
}