//using Oak a middleware framework for Deno
import {  Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { redis } from './redis.ts'

const app = new Application();

const typeDefs = gql`
  type People {
    name: String
    mass: Int
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    species_id: Int
    homeworld_id: Int
    height: Int
  }
  type Query {
    getPeople : [People]
  }
  `;

  const resolvers = {
    Query: {
        getPeople: async(root : any, args : any, context : any, info : any) => {
            const person = await client.queryObject('SELECT * FROM people WHERE _id=1');
            return person.rows;
        }
    }
  }



const PORT = 3000;
// app.use((ctx) => {
//     ctx.response.body = 'Hello Deno!!!'
// });
const GrapQLService = await applyGraphQL<Router>({
  Router,
typeDefs,
resolvers,
context: (ctx) => {

}
});
app.use(GrapQLService.routes(), GrapQLService.allowedMethods());
app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
});

console.log(await redis.ping());
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();
console.log(`Server listening on Port: ${PORT}`);
await app.listen( {port: PORT});


