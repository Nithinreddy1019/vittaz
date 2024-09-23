import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TransactionsSchema } from "@/prisma/zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import { subDays, parse } from "date-fns";


const app = new Hono()
    .get("/",
        zValidator("query", z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional()
        })),
        async (c) => {

        const session = await auth();
        const { from , to , accountId } = c.req.valid("query")

        if(!session?.user?.id) {
            return c.json({ error: "Unauthorized"}, 401)
        }

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from 
            ? parse(from, "yyyy-MM-dd", new Date()) 
            : defaultFrom;
        const endDate = to
            ? parse(to, "yyyy-MM-dd", new Date())
            : defaultTo;

        const whereClause = {
            account: {
                userId: session.user.id
            },
            date: {
                gte: startDate,
                lte: endDate
            }
        } as {
            account: { userId: string },
            date: { gte: Date, lte: Date },
            accountId?: string
        };

        if(accountId) {
            whereClause.accountId = accountId
        }
        
        const data = await db.transactions.findMany({
            select: {
                id: true,
                payee: true,
                notes: true,
                amount: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                },
                accountId: true,
                account: {
                    select: {
                        name: true
                    }
                },
                date: true
            },
            where: whereClause,
            orderBy: {
                date: "desc"
            }
        });

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

            const data = await db.transactions.findUnique({
                where: {
                    id: id,
                    account: {
                        userId: session.user.id
                    },
                    accountId: {
                        not: undefined
                    }
                },
                select: {
                    id: true,
                    payee: true,
                    notes: true,
                    amount: true,
                    categoryId: true,
                    accountId: true,
                    date: true
                },
            });

            if(!data) {
                return c.json({ error: "Not found" }, 404)
            };

            return c.json({ data })

        }
    )
    .post("/",
        zValidator("json", TransactionsSchema.omit({
            id: true
        })),
        async (c) => {
            const session = await auth();
            const values = c.req.valid("json")

            if(!session?.user?.id) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            
            const data = await db.transactions.create({
                data: {
                    ...values
                }
            })
            
            return c.json({ data })
    })
    .post("/bulk-create",
        zValidator(
            "json",
            z.array(
                TransactionsSchema.omit({
                    id: true
                })
            )
        ),
        async (c) => {
            const session = await auth();
            const values = c.req.valid("json");

            if(!session?.user?.id) {
                return c.json({ error: " Unauthoprized"}, 401)
            };

            // const data = await db.transactions.createMany({
            //     data: values
            // });

            const createPromises = values.map((value) => (
                db.transactions.create({
                    data: value
                })
            ));

            const data = await Promise.all(createPromises);

            return c.json({ data })
        }
    )
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

            const responseData = await db.transactions.deleteMany({
                where: {
                    account: {
                        userId: session.user.id
                    },
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
            TransactionsSchema.omit({
                id: true
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

            const data = await db.transactions.update({
                where: {
                    id: id,
                    account: {
                        userId: session.user.id
                    }
                },
                data: {
                    ...values
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

            const data = await db.transactions.delete({
                where: {
                    id: id,
                    account: {
                        userId: session.user.id
                    }
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