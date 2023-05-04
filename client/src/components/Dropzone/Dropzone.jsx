import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { MultipleFileUpload } from './MultipleFileUpload'

export function MyDropzone() {
     const [files, setFiles] = useState([])
  const onDrop = useCallback((accFiles, rejFiles) => {
    const mappedAcc = accFiles.map(file => ({file, errors: []}))
    setFiles(curr => [...curr, ...mappedAcc, ...rejFiles])
  }, [])

  function onDelete(file) {
     setFiles(curr => {
          return curr.filter(fw => fw.file !== file)
     })
  }
  function onUpload(file, url) {
     setFiles(curr => {
          return curr.map(fw => {
               if(fw.file === file){
                    return {...fw, url}
               }
               return fw
          })
     })
  }

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
     <React.Fragment>
          <div {...getRootProps()}>
               <input {...getInputProps()} />
                    <p>Odaberi datoteku za prijenos...</p>
          </div>
          {files.map((fileWrapper, idx) => (
               <MultipleFileUpload key={idx} file={fileWrapper.file} onDelete={onDelete} onUpload={onUpload} />
          ))}
    </React.Fragment>
  )
}