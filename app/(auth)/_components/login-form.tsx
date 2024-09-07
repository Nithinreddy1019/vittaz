"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormLabel,
    FormMessage,
    FormItem,
    FormField
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth-schemas";
import { CardWrapper } from "./card-wrapper";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { SigninAction } from "@/actions/signin-action";
import { toast } from "sonner";
import { redirect } from "next/navigation";


export const LoginForm = () => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            SigninAction(values)
                .then((data) => {
                    if(data?.error) {
                        toast.error(data.error);
                        return
                    }
                    if(data?.success) {
                        toast.success(data.success);
                    }
                })
        })
    }

    return (
        <div className="h-full flex flex-col">
            <Image
                src={"/vittaz-logo.svg"}
                alt="logo"
                height={50}
                width={50}
                className="ml-4 mt-4"
            />
            <CardWrapper
                headerLabel="Sign in"
                subHeaderLabel="to continue to vittaz"
                backButton="Don't have an account?"
                backButtonHref="/signup"
                showSocials
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="email"
                                                placeholder="youremail@gmail.com"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="password"
                                                placeholder="* * * * * * "
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            variant={"link"}
                            className="px-0"                       
                        >
                            Forgot password?
                        </Button>

                        <Button 
                            className="w-full font-semibold"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin"/>
                                    <p>Sign in</p>
                                </div>
                            ): "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}