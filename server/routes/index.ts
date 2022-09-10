import { Application, Middleware, Router  } from "https://deno.land/x/oak/mod.ts";
import { requestTraceMiddleware } from "https://deno.land/x/oak_middlewares/mod.ts";
import gqlrouter from "./graphql.ts";

const baseRoute = new Router();

baseRoute.get("/", (context) => {
    context.response.body = `<b>Please use <a href="/graphql">/graphql</a> to query</b>`;
    context.response.headers.append("Content-Type", "text/html; charset=UTF-8");
  });
  
  export default function init(app: Application) {
    app.use(
      requestTraceMiddleware<Middleware>({ type: "combined" })
    );
    app.use(baseRoute.routes());
    app.use(gqlrouter.routes());
    app.use(gqlrouter.allowedMethods());
  }