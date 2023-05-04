export function FileHeader({file, onDelete}){
     return <>
     <div className="file">
          <div>{file.name}</div>
          <button className="gumb-ob" id="delete" onClick={() => onDelete(file)}>Obriši</button></div>
     </>
}