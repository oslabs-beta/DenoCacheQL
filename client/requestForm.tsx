import React, { useRef } from 'https://esm.sh/react@18.2.0';

// import { TextField } from 'https://jspm.dev/@material-ui/core@4.11.0';

// const handleSubmit = (e: React.MouseEvent) => {
//   e.preventDefault();

//   console.log('clicked!');

// };

// export default function RequestForm() {
//   return (

//       <div className="test" onClick={handleSubmit}>
//         <button onClick={handleSubmit}>Submit</button>

//       </div>

//   );
// }
const RequestForm: React.FC = () => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // let text = textInputRef.current!.value;
    console.log('clicked');
    // console.log(text);
  };
  return (
    <div>
      <label htmlFor="text"></label>
      <input type="text" ref={textInputRef} />
      <button type="button" onClick={(e) => handleSubmit(e)}>
        Submit
      </button>
    </div>
  );
};
export default RequestForm;
