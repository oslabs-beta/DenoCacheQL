/// <reference lib="dom" />
import creator from "./creator.js";
import select from "./select.js";

export default function(name) {
  return select(creator(name).call(document.documentElement));
}
