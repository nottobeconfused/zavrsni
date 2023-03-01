import React from 'react'

function ModalNovo({open, onClose}) {
  if (!open) return null
  return (
    <div className='modal-novo' onClick={onClose}>
    <div className="modal-objava modal-sredina"><i className="uil uil-notes"></i><p>Nova objava</p></div>
    <div className="modal-dodaj-korisnika modal-sredina"><i className="uil uil-user-plus"></i><p>Dodaj korisnika</p></div>
    </div>
  )
}

export default ModalNovo