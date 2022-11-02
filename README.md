<!--
Resource for markdown formatting
https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
-->

<div align = 'center'>
<img src = "https://github.com/oslabs-beta/DenoGraphQL/blob/main/assets/readme/DQL%20cover%20photo%20readme(600%20%C3%97%20275%20px)%20for%20readme.png?raw=true" alt = "banner" />

<div id='badges'>
<a href ="#"><img src = 'https://img.shields.io/badge/LinkedIn-blue'/></a>
<a href = "#"><img src = 'https://img.shields.io/badge/license-MIT-blue'/></a>

<p>A light-weight caching solution for GraphQL with Deno</p>
</div>
</div>

## Table of Contents
- [What is DenoCacheQL?](#about)
- [Getting Started](#getting-started)
  - [Set-up](#set-up)
  - [Implementing the Cache](#implementing)
  - [Clearing the Cache](#clearing-the-cache)
- [Using the Front-end Playground](#using-the-front-end-playground)
  - [Queries and Mutations](#queries-and-mutations)
- [Future Plans](#future-plans)
- [Reporting Issues](#reporting-issues)

## <a name = "about"></a> What is DenoCacheQL?

With DenoCacheQL, a developer can quickly and easily cache their GraphQL queries on their Redis server for more efficient queries. The DenoCacheQL playground allows a developer to test their GraphQL queries, receiving back the responses from their queries, the response times, and the response source (database or cache).  We've also included a graph of the response time for easy latency visualization.

## <a name = "getting-started"></a>📖 Getting Started 📖

### <a name = "set-up"></a>How to set up the DenoCacheQL 

To set up your server to use DenoCacheQL: 
 - Import DenoCacheQL, your resolvers, and your typeDefs.
 - Make sure the redis server is up and running.
 - Create a new instance of DenoCacheQL.
 - Configure the server to use DenoCacheQL routes.

Example set up:

```
//import 
import  DenoCacheQL  from './denoCache.ts' *replace link
import {resolvers, typeDefs} from "./schema.ts" 

//creating a new instance
const dc = new DenoCacheQL({
  typeDefs,
  resolvers, 
  redisInfo: {
    hostname: HOST_NAME,
    port: PORT,
    password: OPTIONAL_PASSWORD,
  }
})

//using DC routes
app.use(dc.routes());
app.use(dc.allowedMethods());

//exporting to use in your resolver logic
export { dc };
```

### <a name = "implementing"></a>How To Implement Caching Functionailty

Once you've imported the module and created your DenoCacheQL instance, you'll be able to access the DenoCacheQL functions from the context argument.  Because DenoCacheQL implementation is modular, you can choose the specific resolvers in which you want to use the caching functionality.  One easy way to implement the caching functionality is by wrapping your resolver logic as a callback inside the DenoCacheQL cache function, as demonstrated below.
 
```
const resolvers = {
  Query: {
    myQuery: async (parent, arg, context, info) => {
    return await context.dc.cache({parent, arg, context, info}, async() => {
       //put your resolver logic here
       ....
      })
    }
  },
```

You can also destructure cache from context.dc.

```
const resolvers = {
  Query: {
    myQuery: async (parent, arg, context, info) => {
    const {dc} = context 
    return await dc.cache({parent, arg, context, info}, async() => {
       //put your resolver logic here
       ...
      })
    }
  },
  ```
### <a name = "clearing-the-cache"></a>How to clear the cache

If you would like to mutate your data and clear the cache at the same time so that incorrect data doesn't remain in the cache, DenoCacheQL provides a flush function. Call this function whenever you would like to clear the cache, or you may use the redis.flushall() in the redis terminal. 

```
Mutation: {
  myMutation: async (parent, arg, context, info) => {
    //put your mutation logic here
    ...
     await context.dc.flush()
    })
  }
```

## <a name = "using-the-front-end-playground"></a>Using the Front-End Playground
### <a name = "queries-and-mutations"></a>Testing Queries and Making Mutations 

![Animation of Front-End Query](./assets/readme/DQL%20readme%20demo%20(940%20%C3%97%20760%20px).gif)


**To use the front-end playground use the URL endpoint /graphql.**

We made the front-end playground as intuitive as possible by allowing developers to input queries and mutations with the same syntax they expect from GraphQl. After submitting a query, the returned response will be displayed to the right of the query. 

We built the bottom half of the playground to visualize the caching times. Each query response is stored in the table and is recorded with the source of the data coming back (either the database or the cache), as well as the latency. A chart is also rendered and updated with each query to give a full picture of the efficiency of the cache. 

## <a name = "future-plans"></a>🔮 Future Plans 🔮

- Add client-side caching
- Add an option for cache expiration
- Expand functionality of the playground to include
  - Button to clear the query field
  - Button to clear the cache
  - Add tab functionality in the query field

  ### Want to Contribute? 


## <a name = "Reporting Issues"></a>⚠️ Reporting Issues ⚠️
We are currently in beta and listening for any feedback and issues you may run into. If you are experiencing any difficulty with this module, please open a GitHub Issue. Thank you for your patience and ongoing support! 🙏


