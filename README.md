<!-- 
Resource for markdown formatting
https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax 
-->

<!-- Import Logo here -->
![DenoCacheQL cover photo](./assets/logos/DQL%20cover%20photo%20readme(600%20%C3%97%20275%20px)%20for%20readme.png)
# DenoCacheQL
<!-- Beta version?  -->


## What is DenoCacheQL
<!-- We can pull info from our medium article to use here -->
With DenoCacheQL, a developer can quickly and easily cache their GraphQL queries on their Redis server for more efficient queries.  The DenoCacheQL playground allows a developer to test their GraphQL queries, receiving the responses and the response times, in order to see the time saved by using the cache.

## Getting started

### How to set up the DenoCacheQL
<!-- backend -->
-import the module using the denoland url (add later)
-import your typeDefs
-import your resolvers
-get your Redis server started
(show example code? )

-need to create a denocache class 

const dc = new DenoCache({
  typeDefs,
  resolvers, 
  redisInfo: {
    hostname: "(your host link)",
    port: (enter port number),
    password: "(optional)",
  }
})

### How to implement the cache clear and cache function into the resolvers
(show code)


## Using the front-end playground
show screenshots
### Testing Queries 
<!-- how to make queries and what they should expect to see on the FE -->
### Making Mutations
<!-- how to make mutations and what they should expect to see on the FE -->

## Future Plans
- add client-side caching
## Reporting Issues
<!-- github issues -->