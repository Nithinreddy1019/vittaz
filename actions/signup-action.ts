"use server"

import * as z from "zod";
import * as bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas/auth-schemas";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const SignupAction = async (values: z.infer<typeof RegisterSchema>) => {

    const validatedFields = RegisterSchema.safeParse(values);
    if(!validatedFields.success) {
        return { error: "Invalid field values" }
    };

    const { email, password, username } = validatedFields.data;

    const existingUser = await db.user.findUnique({
        where: { email }
    });
    if(existingUser) {
        return { error: "Email already in use" }
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await db.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword
            }
        });

        return { success: "User created successfully" }
    } catch (error) {

        return { error: "Something went wrong" }
    }
}