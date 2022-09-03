import { client } from '../server.tsx';
import { gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { redis } from './redis.ts';
import { graphqlHttp } from 'https://deno.land/x/deno_graphql/oak.ts';
const typeDefs = gql`
  type People {
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
  }
`;

const resolvers = {
  Query: {
    getPeople: async (parent: any, arg: any, context: any, info: any) => {
      console.log('arg', arg);

      const redisKey = `SELECT name,mass, hair_color, skin_color, eye_color, birth_year, gender, height FROM people WHERE _id=${arg.characterNumber}`;

      //look in the cache for the provided query
      console.time();
      const person = await redis.exists(redisKey);
      if (!person) {
        console.log('entered conditional');
        //otherwise, we make the call to the client
        const character = await client.queryObject<string>(redisKey);
        console.log('Character.rows', character.rows);
        //then save the query and the response as the key value pair in redis
        await redis.set(redisKey, JSON.stringify(character.rows));
        // //return the responsect
        const timeFromServer = console.timeEnd();
        return character.rows;
      }
      //if we find the value, then return
      const formatThis = await redis.get(redisKey);
      console.timeEnd();
      console.log('format....', formatThis);
      if (typeof formatThis !== 'string') {
        let format = JSON.stringify(formatThis);
        return JSON.parse(format);
      } else {
        let formattedResponse = JSON.parse(formatThis);
        // console.log('parent --->', parent);
        // console.log('id --->', id);
        // console.log('context --->', context);
        // console.log('info --->', info.returnType);
        return formattedResponse;
      }

      // console.log('after formatting....', formatThis);
      // const timeFromCache = console.timeEnd();
      // return format;
    },
  },
};
const usePlayground = true;
export { resolvers, typeDefs, usePlayground };
