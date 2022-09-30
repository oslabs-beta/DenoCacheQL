/// <reference lib="dom" />
function none() {}

export default function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}
