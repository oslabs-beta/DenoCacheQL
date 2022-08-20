//using Oak a middleware framework for Deno
import {  Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { redis } from './redis.ts'
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers } from './graphql.ts';



const app = new Application();


const PORT = 3000;

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  context: (ctx) => {}
  });


app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
});

console.log(await redis.ping());

const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();


await app.listen( {port: PORT});

export { client }


