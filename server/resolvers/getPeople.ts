import { client } from '../server.tsx';
import { redis } from '../redis.ts';

const PeopleResolver = {
  Query: {
    getPeople: async (parent: any, arg: any, context: any, info: any) => {

      //console.log('arg', arg);
      // console.log('context', context)
      console.log("parent", parent)

      console.log("info", info)
      const redisKey = `SELECT name,mass, hair_color, skin_color, eye_color, birth_year, gender, height FROM people WHERE _id=${parent.characterNumber}`;

      //look in the cache for the provided query
      // console.time();
      const person = await redis.exists(redisKey);
      if (!person) {
        console.log('entered conditional--- getting from sql server');
        //otherwise, we make the call to the client
        const character = await client.queryObject<string>(redisKey);
        console.log('Character.rows', character.rows);
        //then save the query and the response as the key value pair in redis
        await redis.set(redisKey, JSON.stringify(character.rows));
        // //return the responsect
        // console.timeEnd();
        arg.response.headers.set('Source', 'database');
        return character.rows;
      }
      //if we find the value, then return

//---------- return result and latency from redis ------------
      const formatThis = await redis.get(redisKey);
      // console.timeEnd();
      console.log('format....getting from redis', formatThis);
      arg.response.headers.set('Source', 'redis');

      if (typeof formatThis !== 'string') {
        let format = JSON.stringify(formatThis);
        return JSON.parse(format);
      } else {
        let formattedResponse = JSON.parse(formatThis);
        return formattedResponse
      }
      
    },
  },
};
export default PeopleResolver;