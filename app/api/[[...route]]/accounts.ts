import { db } from "@/lib/db";
import { Hono } from "hono";


const app = new Hono()
    .get("/" ,async (c) => {
        const data = await db.accounts.findMany({
            select: {
                id: true,
                name: true
            }
        })

        return c.json({ data })
    });


export default app