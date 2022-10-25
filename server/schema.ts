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
      console.log('info', info)
      console.log('arg', arg)
    return await context.dc.cache({arg,info,context}, async() => {       
        const sqlQuery = `SELECT name,mass, hair_color, skin_color, eye_color, birth_year, gender, height, species_id FROM people WHERE _id=${arg.characterNumber}`;
        const character = await client.queryObject<string>(sqlQuery);
        character.rows[0].species_id = Number(character.rows[0].species_id)
        return character.rows
      }) 
    }
  },
  People: {
    species: async (parent: any, arg: any, info: any) => {
              console.log('parent', parent)
              const redisKey = `SELECT name, classification FROM species WHERE _id=${parent.species_id}`;
              const character = await client.queryObject<string>(redisKey);
              return character.rows
  }
},

  // Species:{
  //   _id(parent){
  //     console.log('this is the parent resolver', parent)
  //     console.log('id:', parent.species_id)
  //     return {name: 'test'}
  //   }
  // },
  // Species:{
  //     _id{
  //       console.log(resolve)
  //   async (parent: any, arg: any, context: any, info: any) => {
  //     console.log('in species resolver')
 
  //     console.log("parent", parent)
  //     console.log('arg:', arg)
  //     return await context.dc.cache({arg,info,context}, async() => {       
  //       const redisKey = `SELECT name, classification FROM species WHERE _id=${arg.speciesID}`;
  //       const character = await client.queryObject<string>(redisKey);
  //       return character.rows
  //     })
  //     }
  //   }
  // },
  
  Mutation: {
    setPeople: async (parent: any, arg:any, context: any, info: any) => 
    {
      return await context.dc.flush(async() =>{
        const modify = `UPDATE people SET name = '${arg.name}', mass = '${arg.mass}' WHERE _id = ${arg.characterNumber};`
        const result = await client.queryObject<string>(modify);
        console.log(result.query.result_type)
        return result.query.result_type;})

    }
  }

}



  export default {typeDefs, resolvers}







