
import PeopleResolver from "./getPeople.ts";

const resolvers = Object.assign(
  {},
  ...[PeopleResolver].map((x) => x.Query)
);
export default resolvers;