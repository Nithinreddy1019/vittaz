import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { ArrowRight } from "lucide-react"
import Image from "next/image"



export const Navigation = () => {
    return (
        <header className="py-4 sticky top-0 z-10 backdrop-blur ">
            <div className="container">
                <div className="flex items-center justify-between md:max-w-3xl md:mx-auto md:border md:border-white/15 py-4 px-4 rounded-3xl">
                    <div className="border border-white/25 rounded-lg p-2">
                        <Image 
                            src={"/vittaz-logo-white.svg"}
                            alt="logo"
                            width={25}
                            height={25}
                        />
                    </div>

                    <div className="hidden md:block">
                        <nav className="flex items-center gap-4">
                            <a className="px-4 py-1.5 rounded-xl hover:bg-white/15 cursor-pointer transition-all duration-400">Home</a>
                            <a className="px-4 py-1.5 rounded-xl hover:bg-white/15 cursor-pointer transition-all duration-400">Features</a>
                            <a className="px-4 py-1.5 rounded-xl hover:bg-white/15 cursor-pointer transition-all duration-400">Developers</a>
                            <a className="px-4 pl-10 py-1.5 rounded-xl group bg-white/15 cursor-pointer flex items-center gap-2">
                                <p>Github</p> 
                                <GitHubLogoIcon />
                                <div className="h-5 w-5">
                                    <ArrowRight strokeWidth={3} className="size-0 group-hover:size-4 mr-0 group-hover:-rotate-45 transition-all"/>
                                </div> 
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-5">
                        <Button>
                            Get it for free
                        </Button>
                    </div>   
                </div>
            </div>
        </header>
    )
}