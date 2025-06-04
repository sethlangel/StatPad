'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation';
import { Device } from '@capacitor/device';
import { Home, Clock, Users, ChartArea } from 'lucide-react';

export default function Navbar({ children }: { children: React.ReactNode }) {

    const auth = useAuth()
    const router = useRouter()

    const [isMobile, setIsMobile] = useState(false);

    const [activeTab, setActiveTab] = useState(0);

    const navItems = [
        { icon: Home, label: 'Home', url: "/home" },
        { icon: ChartArea, label: 'Stats', url: "/stats" },
        { icon: Users, label: 'Social', url: "/social" },
        { icon: Clock, label: 'Watch', url: "/watch" }
    ];

    const logDeviceInfo = async () => {
        const info = await Device.getInfo();
        if (info.operatingSystem === "ios") setIsMobile(true)
        console.log(isMobile)
    };

    useEffect(() => {
        logDeviceInfo()
    }, [auth])

    return (
        auth.isLoggedIn() && !isMobile ?
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
            </> :
            <>
                <div className="flex flex-col items-center justify-center bg-base-100 p-4">
                    <div className="fixed bottom-0 left-0 right-0 statpad-gradient border-t border-base-100 shadow-lg">
                        <div className="flex relative">
                            {navItems.map((item, index) => {
                                const IconComponent = item.icon;
                                const isActive = activeTab === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setActiveTab(index)
                                            router.push(item.url)
                                        }}
                                        className={`flex-1 flex flex-col items-center py-3 mb-3 px-2 transition-colors duration-200 ${isActive
                                            ? 'text-base-100'
                                            : 'text-base-200 hover:text-gray-700'
                                            }`}
                                    >
                                        <IconComponent
                                            size={24}
                                            className={`mb-1 ${isActive ? 'text-base-100' : ''}`}
                                        />
                                        <span className={`text-xs font-medium ${isActive ? 'text-base-100' : 'text-base-200'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}

                            <div
                                className="absolute top-0 h-1 bg-white transition-all duration-300 ease-out"
                                style={{
                                    width: `${100 / navItems.length}%`,
                                    left: `${(activeTab * 100) / navItems.length}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='pb-20'>
                    {children}
                </div>
            </>
    )
}

