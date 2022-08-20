
import { client } from './server.ts'
import { gql } from 'https://deno.land/x/oak_graphql/mod.ts';

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
    getPeople : [People]
  }
  `;


  const resolvers = {
    Query: {
        getPeople: async() => {
            const person = await client.queryObject('SELECT * FROM people WHERE _id=1');
            return person.rows;
        }
    }
  }



export { resolvers, typeDefs}

