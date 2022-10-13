import { Router, Context } from 'https://deno.land/x/oak@v10.6.0/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
import { graphql } from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
import { connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';

export default class DenoCache {
  router: Router;
  route: string;
  typeDefs: any;
  resolvers: any;
  schema: any;
  jsBundle: any;
  js: any;
  html: any;
  redis: any;

  constructor(args: any) {
    const { typeDefs, resolvers, redisInfo } = args;

    this.setSchema(typeDefs, resolvers);
    this.router = new Router();
    this.route = '/graphql';
    this.redisConnect(redisInfo);
    this.allowedMethods();
  }

  async redisConnect(redisInfo): any {
    this.redis = await connect(redisInfo);
    console.log(await this.redis.ping());
  }

  setSchema(typeDefs, resolvers): any {
    this.schema = makeExecutableSchema({
      typeDefs: typeDefs.typeDefs,
      resolvers: resolvers.resolvers || {},
    });
  }

  async flush(callback: Function) {
    await this.redis.flushall();
    const res = await callback();
    return res;
  }

  async cache({ arg, info, context }: any, callback: Function) {
    //get redisKey
    // console.log('arg', arg)
    // console.log('resolver name', info.fieldName)
    const redisKey = info.fieldName + ' ' + JSON.stringify(arg);
    //console.log('redisKey:', redisKey)
    //check redis for cached value
    const data = await this.redis.exists(redisKey);
    if (data) {
      const result = await this.redis.get(redisKey);
      // console.log('data in redis', result)
      context.response.headers.set('Source', 'cache');
      //console.log ('type', typeof result)
      if (typeof result !== 'string') {
        let format = JSON.stringify(result);
        let formattedResponse = JSON.parse(format);
        //console.log('formatted1', formattedResponse)
        return formattedResponse;
      } else {
        let formattedResponse = JSON.parse(result);
        //console.log('formatted2', formattedResponse)
        return formattedResponse;
      }
    } else {
      const res = await callback();
      //console.log('response from cb', res)
      await this.redis.set(redisKey, JSON.stringify(res));
      context.response.headers.set('Source', 'database');
      return res;
    }
  }

  routes(): any {
    //serving our graphql IDE

    const jsBundle = '/main.js';
    const js = `import React from "https://esm.sh/react@18.2.0";
    import ReactDOM from "https://esm.sh/react-dom@18.2.0";
    const App = ${App};
    ReactDOM.hydrateRoot(document.getElementById('app'), React.createElement(${App}));`;

    const appHtml = ReactDOMServer.renderToString(React.createElement(App));

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" type="text/css" href="/static/style.css">
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
      height: 250px;
      width: 98%;
      border: 1px solid rgb(158, 185, 195);
      border-radius: 4px;
      outline: none;
      overflow: auto;
      overflow-wrap: break-word;
      box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
      rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
      padding: 30px;
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
      padding: 30px;
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
      text-align: left;
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
        const { query, variables } = await request.body().value;
        //console.log('query:' , query )
        const results = await graphql({
          schema: this.schema,
          source: query,
          variableValues: variables,
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

  allowedMethods(): any {
    return this.router.allowedMethods();
  }
}
