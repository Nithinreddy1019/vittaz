"use client"

import {
    Card,
    CardHeader,
    CardFooter,
    CardContent
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Socials } from "./socials"
import { Button } from "@/components/ui/button"


interface CardWrapperProps {
    headerLabel: string,
    subHeaderLabel: string,
    backButton: string,
    backButtonHref: string,
    showSocials?: boolean,
    children: React.ReactNode
}


export const CardWrapper = ({
    headerLabel,
    subHeaderLabel,
    backButton,
    backButtonHref,
    showSocials,
    children
}: CardWrapperProps) => {
    return (
        <Card className="w-full h-full shadow-none border-none md:px-4 lg:px-12 xl:px-20 pt-2">
            <CardHeader className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">{headerLabel}</h1>
                    <p className="text-sm">{subHeaderLabel}</p>
                </div>
                {/* WIP: Show socials */}
                {showSocials && (
                    <Socials />
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <Button
                    variant={"link"}
                    className="px-0" 
                    asChild                      
                >
                    <Link href={backButtonHref} className="">
                    {backButton}
                    </Link>
                </Button>

            </CardFooter>
        </Card>
    )
}