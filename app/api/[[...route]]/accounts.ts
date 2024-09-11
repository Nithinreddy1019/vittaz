import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";


const app = new Hono()
    .get("/" ,async (c) => {

        const session = await auth();
        if(!session?.user?.id) {
            throw new HTTPException(401, {
                res: c.json({error: "Unauthorized"}, 401)
            })
        }

        const data = await db.accounts.findMany({
            select: {
                id: true,
                name: true
            }
        })

        return c.json({ data })
    });


export default app