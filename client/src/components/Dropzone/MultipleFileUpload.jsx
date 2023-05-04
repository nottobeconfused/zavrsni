import { useField } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { UploadError } from './UploadError';
import { FileUpload } from './FileUpload';

export function MultipleFileUpload({name}){
     const [_, __, helpers] = useField(name)

     const [files, setFiles] = useState([])
     const onDrop = useCallback((accFiles, rejFiles) => {
          const mappedAcc = accFiles.map((file) => ({file, errors: []}))
          setFiles((curr) => [...curr, ...mappedAcc, ...rejFiles])
     }, [])

     useEffect(() => {
          helpers.setValue(files)
     }, [files])

     function onUpload(file, url) {
          setFiles((curr) =>
            curr.map((fw) => {
              if (fw.file === file) {
                return { ...fw, url };
              }
              return fw;
            })
          );
        }
      
        function onDelete(file) {
          setFiles((curr) => curr.filter((fw) => fw.file !== file));
        }
      
        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          maxSize: 50000 * 1024, // 300KB
        });
      
        return (
          <React.Fragment>
            <div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
      
                <p id="dat-odabir">Odaberi datoteke</p>
              </div>
            </div>
      
            {files.map((fileWrapper) => (
              <div key={fileWrapper.id}>
                {fileWrapper.errors.length ? (
                  <UploadError
                    file={fileWrapper.file}
                    errors={fileWrapper.errors}
                    onDelete={onDelete}
                  />
                ) : (
                  <FileUpload
                    onDelete={onDelete}
                    onUpload={onUpload}
                    file={fileWrapper.file}
                  />
                )}
              </div>
            ))}
          </React.Fragment>
        );
}