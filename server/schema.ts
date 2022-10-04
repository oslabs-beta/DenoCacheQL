import { client } from './server.tsx';

//import buildASTSchema from "https://cdn.skypack.dev/graphql@%5E15.0.0";
import { buildSchema, GraphQLSchema } from "https://cdn.skypack.dev/graphql@%5E15.0.0";
import { decodeComponent } from 'https://deno.land/x/oak@v11.1.0/util.ts';

//  const base = `
//      type Query {
//         getPeople(characterNumber: Int): [People]
//         }` 

  const typeDefs = 
  `type People {
    _id: Int
    name: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    height: Int
  }
  type Query {
    getPeople(characterNumber: Int): [People]
    }`

   const resolvers = {
  Query: {
    getPeople: async (parent: any, arg: any, context: any, info: any) => {
      console.log("context", context)
      console.log('arg:', arg)
    return await context.dc.cache({arg,info}, async() => {       
        const redisKey = `SELECT name,mass, hair_color, skin_color, eye_color, birth_year, gender, height FROM people WHERE _id=${arg.characterNumber}`;
        //console.log('in the query')
        const character = await client.queryObject<string>(redisKey);
        //console.log('Character.rows', character.rows);
        context.response.headers.set('Source', 'database')
        //then save the query and the response as the key value pair in redis
        
        // //return the responsect
        return character.rows
      }) 

    },
  }
   }


  // const schema = buildSchema([base, PeopleSchema].join("\n"), {});
//console.log(schema)
  export default {typeDefs, resolvers}







