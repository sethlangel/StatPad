'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth'
import { Device } from '@capacitor/device';
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';

export default function Navbar({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    const logDeviceInfo = async () => {
        const info = await Device.getInfo();
        if (info.operatingSystem === "ios") setIsMobile(true)
        console.log(isMobile)
    };

    useEffect(() => {
        logDeviceInfo()
    }, [auth])

    if (auth.isLoggedIn()) {
        return isMobile ?
            <NavbarMobile>{children}</NavbarMobile> :
            <NavbarDesktop>{children}</NavbarDesktop>
    }
    else return (<>{children}</>)
}

