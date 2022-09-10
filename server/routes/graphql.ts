import { Router } from "https://deno.land/x/oak/mod.ts"

const gqlrouter = new Router();

gqlrouter
    .get('/graphql', (context) => {
        context.response.body = "Please use Post to Query"
    })
    .post('/grpahql', async (context) => {
        const result = context.request.body();
        if (result.type === "json"){
            const { query, variables = {}} = await result.value;
            if (query) {
                context.response.body = { query, variables}
            } else {
                context.response.body = { message: "Invalid Query"}
                context.response.status = 400;
            }
        }
    });

    export default gqlrouter;