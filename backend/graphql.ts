import { client } from './server.ts';
import { gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { redis } from './redis.ts';

const typeDefs = gql`
  type People {
    name: String
    mass: Int
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    species_id: Int
    homeworld_id: Int
    height: Int
  }
  type Query {
    getPeople: [People]
  }
`;

const resolvers = {
  Query: {
    getPeople: async () => {
      const redisKey = 'SELECT name FROM people WHERE _id=27';
      //const person = await client.queryObject('SELECT * FROM people WHERE _id=1');
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
      console.log('format....', formatThis);
      const formattedResponse = JSON.parse(formatThis);
      console.log('after formatting....', formattedResponse);
      const timeFromCache = console.timeEnd();
      return formattedResponse;
    },
  },
};

export { resolvers, typeDefs };
