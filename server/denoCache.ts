import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { Middleware } from 'https://deno.land/x/oak@v11.1.0/middleware.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
import { type ITypeDefinitions } from 'https://deno.land/x/graphql_tools@0.0.2/utils/index.ts';
import {
  graphql,
  GraphQLSchema,
} from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
import { Redis, connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';
import { RedisInfo, DenoCacheArgs } from '../types.ts';

export default class DenoCacheQL {
  router: Router;
  route: string;
  schema: GraphQLSchema | undefined;
  redis: Redis | undefined;

  constructor(args: DenoCacheArgs) {
    const { typeDefs, resolvers, redisInfo } = args;
    this.setSchema(typeDefs, resolvers);
    this.router = new Router();
    this.route = '/graphql';
    this.redisConnect(redisInfo);
    this.allowedMethods();
  }

  async redisConnect(redisInfo: RedisInfo) {
    this.redis = await connect(redisInfo);
  }

  setSchema(
    typeDefs: Record<string, unknown>,
    resolvers: ITypeDefinitions
  ): void {
    this.schema = makeExecutableSchema({
      typeDefs: typeDefs.typeDefs,
      resolvers: resolvers.resolvers,
    });
  }

  async flush() {
    if (this.redis != undefined) {
      await this.redis.flushall();
      return;
    }
    return;
  }

  async cache({ parent, arg, info, context }: any, callback: Function) {
    //get redisKey
    const redisKey = info.fieldName + ' ' + JSON.stringify(arg);
    //check redis for cached value
    if (this.redis === undefined) {
      return; //error
    }

    const data = await this.redis.exists(redisKey);
    if (data) {
      const result = await this.redis.get(redisKey);
      context.response.headers.set('Source', 'cache');
      if (typeof result !== 'string') {
        const format = JSON.stringify(result);
        const formattedResponse = JSON.parse(format);
        return formattedResponse;
      } else {
        const formattedResponse = JSON.parse(result);
        return formattedResponse;
      }
    } else {
      const res = await callback();
      if (this.redis) {
        await this.redis.set(redisKey, JSON.stringify(res));
      }
      context.response.headers.set('Source', 'database');
      return res;
    }
  }

  routes(): Middleware {
    //serving our graphql IDE

    const jsBundle = '/denocacheql.js';
    const js = `import React from "https://esm.sh/react@18.2.0";
    import ReactDOM from "https://esm.sh/react-dom@18.2.0";
    const App = ${App};
    ReactDOM.hydrateRoot(document.getElementById('app'), React.createElement(${App}));`;

    const appHtml = ReactDOMServer.renderToString(React.createElement(App));

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
      </head>
      <body>
      <style>

      body {
        background-color: #20366b;
      }
      h1 {
      color: #f27370;
      }
      h2 {
      font-size: 26px;
      }
      #app {
        padding: 30px;
      }
   
      #topContainer textarea {
      width: 98%;
      border: 1px solid rgb(158, 185, 195);
      border-radius: 4px;
      outline: none;
      overflow: auto;
      overflow-wrap: break-word;
      box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
      rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
      padding: 20px;
      }
      
      #query_text_box{
        min-height: 120px;
      }

      #variables_text_box{
        height: fit-contents;
      }

      #requestForm,
      #results {
      padding: 18px;
      height: fit-contents;
      background-color: #eae3e3;
    }

    #requestForm button {
      float: right;
      margin-top: 7px;
      background-color: #48395c;
      border-radius: 9px;
      color: white;
    }

    #queryResponse {
      border: 1px solid rgba(55, 0, 255, 0.23);
      padding: 20px;
      border-radius: 4px;
      height: 250px;
      overflow: auto;
      overflow-wrap: break-word;
      box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
      rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    }
    #topContainer, #bottomContainer {
      border: 1px solid rgba(55, 0, 255, 0.23);
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
      border-radius: 8px;
      padding: 0;
  
    }
    #tableContainer {
      background-color: #212529;
      height: 300px;
    }
    #tableResponse {
      overflow-wrap: break-word;
      width: 70%;
    }
    table {
      text-align: center;
      overflow: auto;
    }
    #chart-container{
      padding:0;
      height: 300px;
    }
    #myChart{
      background-color: #ffffff;
    }
    </style>
      <div id="app">${appHtml}</div>
         
      <script type="module" src="${jsBundle}"></script>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    </body>
  </html>`;

    this.router.get(this.route, (context) => {
      context.response.type = 'text/html';
      context.response.body = html;
    });
    this.router.get(jsBundle, (context) => {
      context.response.type = 'application/javascript';
      context.response.body = js;
    });

    //graphql post request
    this.router.post(this.route, async (ctx) => {
      const { response, request } = ctx;
      const start = Date.now();
      try {
        if (this.schema === undefined) {
          return; //error
        }
        const { query, variables } = await request.body().value;
        let parsedVar: Record<string, unknown>;
        if (variables && typeof variables === "string"){
          parsedVar = JSON.parse(variables)
        }
        else {
          parsedVar = variables;
        }
        const results = await graphql({
          schema: this.schema,
          source: query,
          variableValues: parsedVar,
          contextValue: { response, request, dc: this },
        });
        // await this.redis.set(redisKey, JSON.stringify(results))
        response.status = results.errors ? 500 : 200;
        response.body = results;
        const end = Date.now() - start;
        // response.headers.set("Source", "database")
        response.headers.set('X-Response-Time', end.toString());
        return;
      } catch (err) {
        console.error(`${err}`);
        throw err;
      }
    });
    return this.router.routes();
  }

  allowedMethods(): Middleware {
    return this.router.allowedMethods();
  }
}
