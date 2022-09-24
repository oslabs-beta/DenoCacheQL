import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { graphql } from "https://cdn.skypack.dev/graphql@%5E15.0.0";
import schema from "../schema/index.ts";
import resolvers from "../resolvers/index.ts";



const gqlrouter = new Router();
gqlrouter
  .get("/graphql", (context) => {
    context.response.body = "Please use Post to Query";
  })
  .post("/graphql", async (context) => {
    const result = context.request.body();
    if (result.type === "json") {
      const { query, variables = {} } = await result.value;
      if (query) {
        const data = await (graphql as any)(
          schema,
          query,
          resolvers,
          {
            request: context.request,
            response: context.response,
          },
          variables || {}
        );
        // console.log('data is...', data)
        if (data.errors) {
          context.response.body = data;
          context.response.status = 400;
        } else {
          context.response.body = data;
        }
      } else {
        context.response.body = { message: "Invalid Query" };
        context.response.status = 400;
      }
    }
  });

export default gqlrouter;