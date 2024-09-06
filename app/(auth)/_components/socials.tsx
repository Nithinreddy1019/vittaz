"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"


export const Socials = () => {
    return (
        <div className="w-full">
            <Button
                variant={"secondary"}
                className="w-full flex items-center gap-2"
            >
                <Image
                    src={"/icons8-google.svg"} 
                    alt="Logo google"
                    height={20}
                    width={20}
                />
                <p>Signin with Google</p>
            </Button>
        </div>
    )
}


