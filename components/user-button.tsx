"use client"

import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import Link from "next/link";
import { CheckIcon, LogOutIcon, MonitorIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";



export const UserButton = () => {

    const { data, status} =  useSession();
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full">
                    <UserAvatar avatarUrl={data?.user?.image as string} size={40}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Logged in as @{data?.user?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/*WIP:// Develop profile page */}
                <Link href={"/user/profile"}>
                    <DropdownMenuItem>
                        <UserIcon className="size-4 mr-2"/>
                        Profile
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <MonitorIcon className="size-4 mr-2"/>
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <MonitorIcon className="size-4 mr-2"/>
                                System default
                                {theme === "system" && ((<CheckIcon className="ms-2 size-4"/>))}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <SunIcon className="size-4 mr-2"/>
                                Light
                                {theme === "light" && ((<CheckIcon className="ms-2 size-4"/>))}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <MoonIcon className="size-4 mr-2"/>
                                Dark
                                {theme === "dark" && ((<CheckIcon className="ms-2 size-4"/>))}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        signOut()
                    }}
                >
                    <LogOutIcon className="size-4 mr-2"/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}