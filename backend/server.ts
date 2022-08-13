//using Oak a middleware framework for Deno
import { Application } from 'https://deno.land/x/oak/mod.ts';
//import Router
import router from './routes/routes.ts';
//create an instance of application
const app = new Application();
const PORT = 3000;
//Implementing router
app.use(router.routes());
//allow router HTTP methods
app.use(router.allowedMethods());
console.log(`Server listening on Port: ${PORT}`);
await app.listen( {port: PORT});
