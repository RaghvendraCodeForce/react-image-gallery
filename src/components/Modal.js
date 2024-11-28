// src/components/Modal.js
import React from 'react';
import ReactModal from 'react-modal';

function Modal({ image, onClose }) {
  return (
    <ReactModal isOpen={true} onRequestClose={onClose} ariaHideApp={false}>
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <img src={image.urls.regular} alt={image.alt_description} />
      </div>
    </ReactModal>
  );
}

export default Modal;
