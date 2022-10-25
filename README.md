<!--
Resource for markdown formatting
https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
-->

<!-- Import Logo here -->

![DenoCacheQL cover photo](./assets/readme/DQL%20cover%20photo%20readme(600%20%C3%97%20275%20px)%20for%20readme.png)

# DenoCacheQL

<!-- Beta version?  -->

## What is DenoCacheQL

<!-- We can pull info from our medium article to use here -->

With DenoCacheQL, a developer can quickly and easily cache their GraphQL queries on their Redis server for more efficient queries. The DenoCacheQL playground allows a developer to test their GraphQL queries, receiving the responses and the response times, in order to see the time saved by using the cache.

## Getting started

### How to set up the DenoCacheQL

<!-- backend -->

Import the module and set up a DenoCache instance by passing in typeDefs, resolvers, and redis server info.

```
import  DenoCache  from './denoCache.ts' *replace link
import {resolvers, typeDefs} from "./schema.ts" *


const dc = new DenoCache({
  typeDefs,
  resolvers, 
  redisInfo: {
    hostname: HOST_NAME,
    port: PORT,
    password: OPTIONAL_PASSWORD,
  }
})


app.use(dc.routes());
app.use(dc.allowedMethods());
```



### How To Implement Caching Functionailty

Once you've imported the module and created your DenoCache instance, you'll be able to access the DenoCache functions from the context.  Because DenoCache implmentation is modular, you can choose the specific resolvers in which you want to use the caching functionality.  One easy way to implement the caching functionality is by wrapping your resolver logic as a callback inside the DenoCache cache function, as demonstrated below.
 
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

If you want to clear the cache, you can use await redis.flushall(). (Will this work??)

### Mutations

This tool does not currently mutate data stored in the cache. However, if you would like to mutate your data and clear the cache at the same time so that incorrect data doesn't remain in the cache, then simply wrap your mutation logic as a callback inside the DenoCache flush function, as exampled below. 

```
Mutation: {
  myMutation: async (parent, arg, context, info) => {
    return await context.dc.flush(async () => {
    //put your mutation logic here
    ...
    })
  }
}
```

## Using the Front-End Playground

### Testing Queries and Making Mutations

![Animation of Front-End Query](./assets/readme/DQL%20readme%20demo%20(940%20%C3%97%20760%20px).gif)
To use the front-end playground use the URL endpoint /graphql.

We tried to make the front-end playground as intuitive as possible by allowing developers to input queries and mutations with the same syntax they expect from GraphQl. After submitting a query, the returned response will be displayed to the right of the query. 

We built the bottom half of the playground to visualize the caching times. Each query response is stored in the table and is recorded with the source of the data coming back (either the database or the cache), as well as the latency. A chart is also rendered and updated with each query to give a full picture of the efficiency of the cache. 



## Future Plans

- add client-side caching

## Reporting Issues

<!-- github issues -->
