//using Oak a middleware framework for Deno
import {  Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts'
import { GraphQLHTTP } from 'https://deno.land/x/gql/mod.ts'
import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts';
//creating an instance of the router
//const router = new Router();
const typeDefs = gql`
  type Query {
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

  }`
  const resolvers = {
    Query: {
        name: () => {},
        mass: () => {}
    }
  }
  const context = (context: Context) => ({
    request: context.request,
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });




//create an instance of application
const app = new Application();

const PORT = 3000;
app.use((ctx) => {
    ctx.response.body = 'Hello Deno!!!'
})
//Implementing router
//app.use(graphQL_Router.routes());
//allow graphQL_Router HTTP methods
//app.use(graphQL_Router.allowedMethods());
app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
});
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();
console.log(`Server listening on Port: ${PORT}`);
await app.listen( {port: PORT});
