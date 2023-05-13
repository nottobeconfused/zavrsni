function ModalNovo({open, onClose, setObjavaModalOpen, setKorisnikModelOpen}) {
  if (!open) return null
  return (
    <div className='modal-novo' onClick={onClose}>
    <div className="modal-objava modal-sredina gumb" onClick={setObjavaModalOpen}><i className="uil uil-notes"></i><p>Nova objava</p></div>
    <div className="modal-dodaj-korisnika modal-sredina gumb" onClick={setKorisnikModelOpen}><i className="uil uil-user-plus"></i><p>Korisnici</p></div>
    </div>
  )
}

export default ModalNovo