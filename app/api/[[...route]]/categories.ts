import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CategoriesSchema } from "@/prisma/zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";


const app = new Hono()
    .get("/" ,async (c) => {

        const session = await auth();
        if(!session?.user?.id) {
            return c.json({ error: "Unauthorized"}, 401)
        }

        const data = await db.categories.findMany({
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

            const data = await db.categories.findUnique({
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
        zValidator("json", CategoriesSchema.pick({
            name: true
        })),
        async (c) => {
            const session = await auth();
            const values = c.req.valid("json")

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            
            const data = await db.categories.create({
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

            const responseData = await db.categories.deleteMany({
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
    .patch("/:id",
        zValidator(
            "param",
            z.object({
                id: z.string().optional()
            })
        ),
        zValidator(
            "json",
            CategoriesSchema.pick({
                name: true
            })
        ),
        async (c) => {
            const session = await auth();
            const { id } = c.req.valid("param");

            const values = c.req.valid("json");

            if(!id) {
                return c.json({ error: "Missing Id"}, 400);
            };

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const data = await db.categories.update({
                where: {
                    userId: session.user.id,
                    id: id
                },
                data: {
                    name: values.name
                }
            });

            if(!data) {
                return c.json({ error: "Not found" }, 404)
            };

            return c.json({ data })

        }
    )
    .delete("/:id",
        zValidator(
            "param",
            z.object({
                id: z.string().optional()
            })
        ),
        async (c) => {
            const session = await auth();
            const { id } = c.req.valid("param");

            if(!id) {
                return c.json({ error: "Missing Id"}, 400);
            };

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const data = await db.categories.delete({
                where: {
                    id: id
                }
            });

            if(!data) {
                return c.json({ error: "Not found" }, 404)
            };

            return c.json({ 
                id: data.id
            })

        }
    )


export default app;