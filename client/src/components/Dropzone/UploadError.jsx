
   import React from 'react';
   import { FileHeader } from './FileHeader';
   
   
   export function UploadError({ file, onDelete, errors }) {
     return (
       <React.Fragment>
         <FileHeader file={file} onDelete={onDelete} />
         {errors.map((error) => (
           <div key={error.code}>
             <p color="err">{error.message}</p>
           </div>
         ))}
       </React.Fragment>
     );
   }