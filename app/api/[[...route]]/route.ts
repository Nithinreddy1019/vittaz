import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import { authHandler,initAuthConfig,verifyAuth} from "@hono/auth-js"

import Credentials from "@auth/core/providers/credentials";

export const runtime = "edge";

const app = new Hono().basePath("/api");


// Either you can do below or leave as it is - AuthJs middleware will handle it
app.use("*", initAuthConfig(c=>({
    secret: c.env.AUTH_SECRET,
    providers: [
      Credentials
    ],
  })))
app.use("/api/auth/*", authHandler())
app.use("/api/*", verifyAuth())


// Routing
const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)

    
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
