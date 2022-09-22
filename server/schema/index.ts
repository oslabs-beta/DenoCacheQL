import { buildSchema, GraphQLSchema } from "https://cdn.skypack.dev/graphql@%5E15.0.0";
import PeopleSchema from "./people.ts";
const base = `
type Query {
      getPeople(characterNumber: Int): [People]
    }`;

const schema = buildSchema([base, PeopleSchema].join("\n"), {});

export default schema;