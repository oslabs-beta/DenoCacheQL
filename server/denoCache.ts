import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts"
//import { graphql, buildSchema, GraphQLSchema  } from "https://cdn.skypack.dev/graphql@%5E15.0.0";
import type {
  GraphQLSchema
} from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
import PeopleSchema from "./schema.ts";
import schema from "./schema.ts"
import resolvers from "./schema.ts";
import { graphql } from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
// import resolvers from "../resolvers/index.ts";

export default class DenoCache {
  schema: any;
  router: Router;
  route: string;

  constructor(args: any) {
    const {
      schema,
      route = '/graphql'
    } = args

  
    this.router = new Router();
    this.route = route;
  }
 


  routes(): any {
    this.router.post(this.route, async (ctx) => {
      const { response, request } = ctx;
      try {
        const { query, variables } = await request.body().value;
        // resolve GraphQL query
        const graphqlResults = await graphql({
          schema: schema.schema,
          source: query,
          // rootValue: schema.resolvers,
          // pass DenoStore instance through context to use methods in resolvers
          // contextValue: { dc : this },
          variableValues: variables,
        });

        // if errors delete results data
        if (graphqlResults.errors) delete graphqlResults.data;
        // respond with resolved query results
        response.status = graphqlResults.errors ? 500 : 200;
        response.body = graphqlResults;
        return;
      } catch (err) {
        console.error(
          `%cError: error finding query on provided route.
        \nReceived error: ${err}`,
          'font-weight: bold; color: white; background-color: red;'
        );
        throw err;
      }
    });

    return this.router.routes();
  }

  allowedMethods(): any {
    return this.router.allowedMethods();
  }
}