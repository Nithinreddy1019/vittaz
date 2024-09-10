"use client"


import { useSession } from "next-auth/react"
import { Skeleton } from "./ui/skeleton";

export const Welcome = () => {
    const { data, status } = useSession();


    if(status === "loading") {
        return (
            <div className="space-y-2 mb-4">
                <Skeleton className="h-8 lg:h-12 w-32 lg:w-96 bg-white/20"/>
                <Skeleton className="h-4 lg:h-6 w-24 lg:w-80 bg-white/10"/>
            </div>
        )
    }

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome back {data?.user?.name ? data.user.name : ""} 👋
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                This is your Financial Overview Report
            </p>
        </div>
    )
}