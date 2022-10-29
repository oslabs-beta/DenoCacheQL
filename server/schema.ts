import { __Directive } from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import { client } from './server.tsx';

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
    species_id: Int
    species: [Species]
  }

  type Species {
    _id: Int
    name: String
    classification: String
  }

  type Query {
    getPeople(characterNumber: Int): [People]
    species: [Species] 
  }
  type Mutation{
    setPeople(characterNumber: Int, name: String, mass: String): Int
  }  
    `

   const resolvers = {
  Query: {
    getPeople: async (parent: any, arg: any, context: any, info: any) => {
    return await context.dc.cache({parent,arg,context,info}, async() => {       
        const sqlQuery = `SELECT name,mass, hair_color, skin_color, eye_color, birth_year, gender, height, species_id FROM people WHERE _id=${arg.characterNumber}`;
        const character = await client.queryObject<string>(sqlQuery);
        character.rows[0].species_id = Number(character.rows[0].species_id)
        return character.rows
      }) 
    }
  },
  People: {
    species: async (parent: any, arg: any, info: any) => {
              const sqlQuery = `SELECT name, classification FROM species WHERE _id=${parent.species_id}`;
              const character = await client.queryObject<string>(sqlQuery);
              return character.rows
  }
},  
  Mutation: {
    setPeople: async (parent: any, arg:any, context: any, info: any) => 
    {
    
        const modify = `UPDATE people SET name = '${arg.name}', mass = '${arg.mass}' WHERE _id = ${arg.characterNumber};`
        const result = await client.queryObject<string>(modify);
        await context.dc.flush();
        return result.query.result_type;}

  }
}



  export default {typeDefs, resolvers}







