//importing router from method from Oak
import { Router } from 'https://deno.land/x/oak/mod.ts';
//create an instance of router
const router = new Router();

router.get('/', ({ response }: { response: any }) => {
    response.body = {
        message: 'hello world',
    };
});



//exporting router 
export default router;