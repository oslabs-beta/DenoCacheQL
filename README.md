<!--
Resource for markdown formatting
https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
-->

![DenoCacheQL cover photo](./assets/readme/DQL%20cover%20photo%20readme(600%20%C3%97%20275%20px)%20for%20readme.png)

# ✨ DenoCacheQL ✨

## What is DenoCacheQL

With DenoCacheQL, a developer can quickly and easily cache their GraphQL queries on their Redis server for more efficient queries. The DenoCacheQL playground allows a developer to test their GraphQL queries, receiving back the responses from their queries, the response times, and the response source (database or cache).  We've also included a graph of the reposonse time for easy latency visualization.

## 📖 Getting Started 📖

### How to set up the DenoCacheQL 

To set up your server to use DenoCacheQL: 
 - Import DenoCacheQL, resolvers, and typeDefs.
 - Make sure the redis server is up and running.
 - Create a new instance of DenoCache.
 - Configure the server to use DenoCache routes.

Example set up:

```
//import 
import  DenoCache  from './denoCache.ts' *replace link
import {resolvers, typeDefs} from "./schema.ts" 

//creating a new instance
const dc = new DenoCache({
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
```

### How To Implement Caching Functionailty

Once you've imported the module and created your DenoCache instance, you'll be able to access the DenoCache functions from the context argument.  Because DenoCache implmentation is modular, you can choose the specific resolvers in which you want to use the caching functionality.  One easy way to implement the caching functionality is by wrapping your resolver logic as a callback inside the DenoCache cache function, as demonstrated below.
 
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
### How to clear the cache

If you would like to mutate your data and clear the cache at the same time so that incorrect data doesn't remain in the cache, DenoCache provides a flush function. Call this function whenever you would like to clear the cache, or you may use the redis.flushall() in the redis terminal. 

```
Mutation: {
  myMutation: async (parent, arg, context, info) => {
    //put your mutation logic here
    ...
     await context.dc.flush()
    })
  }
```

## Using the Front-End Playground
### Testing Queries and Making Mutations 

![Animation of Front-End Query](./assets/readme/DQL%20readme%20demo%20(940%20%C3%97%20760%20px).gif)


**To use the front-end playground use the URL endpoint /graphql.**

We made the front-end playground as intuitive as possible by allowing developers to input queries and mutations with the same syntax they expect from GraphQl. After submitting a query, the returned response will be displayed to the right of the query. 

We built the bottom half of the playground to visualize the caching times. Each query response is stored in the table and is recorded with the source of the data coming back (either the database or the cache), as well as the latency. A chart is also rendered and updated with each query to give a full picture of the efficiency of the cache. 

## 🔮 Future Plans 🔮

- Add client-side caching
- Add an option for cache expiration
- Expand functionality of the playground to include
  - Button to clear the query field
  - Button to clear the cache
  - Add tab functionality in the query field

## ⚠️ Reporting Issues ⚠️
We are currently in beta and listening for any feedback and issues you may run into. If you are experiencing any difficulty with this module, please open a GitHub Issue. Thank you for your patience and ongoing support! 🙏


