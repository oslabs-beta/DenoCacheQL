//using Oak a middleware framework for Deno
import { Application } from 'https://deno.land/x/oak/mod.ts';

//import Router
import router from './routes/routes.ts';
//create an instance of application
const app = new Application();
const port = 3000;
//Implementing router
app.use(router.routes());
//allow router HTTP methods
app.use(router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
})
console.log("hello world");
await app.listen( { port });
