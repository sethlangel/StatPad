'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Clock, Users, ChartArea } from 'lucide-react';

export default function Navbar({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const navItems = [
        { icon: Home, label: 'Home', url: "/home" },
        { icon: ChartArea, label: 'Stats', url: "/stats" },
        { icon: Users, label: 'Social', url: "/social" },
        { icon: Clock, label: 'Watch', url: "/watch" }
    ];
    return (
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