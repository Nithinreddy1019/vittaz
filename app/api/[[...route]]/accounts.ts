import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AccountsSchema } from "@/prisma/zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";


const app = new Hono()
    .get("/" ,async (c) => {

        const session = await auth();
        if(!session?.user?.id) {
            return c.json({ error: "Unauthorized"}, 401)
        }

        const data = await db.accounts.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                id: true,
                name: true
            }
        })

        return c.json({ data })
    })
    .get("/:id",
        zValidator("param", z.object({
            id: z.string().optional()
        })),
        async (c) => {
            const session = await auth();
            const { id } = c.req.valid("param");
            
            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            if(!id) {
                return c.json({ error: "Bad request, missing Id" }, 400)
            };

            const data = await db.accounts.findUnique({
                where: {
                    userId: session.user.id,
                    id: id
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if(!data) {
                return c.json({ error: "Not found" }, 404)
            };

            return c.json({ data })

        }
    )
    .post("/",
        zValidator("json", AccountsSchema.pick({
            name: true
        })),
        async (c) => {
            const session = await auth();
            const values = c.req.valid("json")

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            
            const data = await db.accounts.create({
                data: {
                    userId: session.user.id,
                    name: values.name,
                }
            })
            
            return c.json({ data })
    })
    .post("/bulk-delete",
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string())
            })
        ),
        async (c) => {
            const session = await auth();
            const values = c.req.valid("json")

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const responseData = await db.accounts.deleteMany({
                where: {
                    userId: session.user.id,
                    id: {
                        in: values.ids
                    }
                }
            });

            const data = values.ids.map((id) => {
                return {id: id}
            });

            return c.json({ data: data })
        
        }
    )


export default app;