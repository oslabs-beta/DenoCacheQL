import React, { useRef } from 'https://esm.sh/react';

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
  const textInputRef = useRef<HTMLInputElement>(null)
  
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  let text = textInputRef.current!.value
  console.log('clicked');
  console.log(text)
}
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='text'></label>
        <input type='text'  ref={textInputRef} />
      </div>
      <button type='submit'>Submit</button>
    </form>
  )
}
export default RequestForm;