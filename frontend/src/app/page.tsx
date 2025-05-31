'use client'

import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoggedIn()) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [auth, router]);

  return null; // You can return a loader or nothing
}