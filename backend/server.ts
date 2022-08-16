//using Oak a middleware framework for Deno
import { Application } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
//import Router
//import router from './routes/routes.ts';
//create an instance of application
const app = new Application();
const port = 3000;
//Implementing router
//app.use(router.routes());
//allow router HTTP methods
//app.use(router.allowedMethods());
app.use((ctx) => {
    ctx.response.body = 'hello world'
});
//listening for the listen object 
app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
})
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();
await app.listen( { port });
