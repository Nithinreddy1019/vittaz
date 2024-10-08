"use server"

import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas/auth-schemas";

import * as z from "zod";
import * as bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_REDIRECT } from "@/routes";

export const SigninAction = async (values: z.infer<typeof LoginSchema>) => {

    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Invalid credentials"}
    };

    const { email, password } = validatedFields.data;
    const userExists = await db.user.findUnique({
        where: { email: email }
    })

    if(!userExists || !userExists.password) {
        return { error: "Email does not exist"}
    }

    const passwordMatches = await bcrypt.compare(password, userExists.password as string)
    if(!passwordMatches) {
        return { error: "Incorrect credentials" }
    }

    try {
        await signIn("credentials" ,{
            email,
            password,
            redirectTo: DEFAULT_REDIRECT
        });
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong" }
            }
        };

        throw error;
    };

    return { success: "Logged in "}
}