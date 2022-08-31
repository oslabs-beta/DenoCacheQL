import React from 'https://esm.sh/react';
// import { TextField } from 'https://jspm.dev/@material-ui/core@4.11.0';

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('clicked!');
  console.log(e);
};

export default function RequestForm() {
  return (
    <>
      <div className="test">
        <h1>this is the test component</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Find Person</label>
          <input type="text"></input>
        </form>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Submit Query
        </button>
      </div>
    </>
  );
}
