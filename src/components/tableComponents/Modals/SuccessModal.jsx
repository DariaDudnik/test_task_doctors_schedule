import React from 'react';
import Modal from 'react-modal';
import baseModalStyle from "./baseModalStyle";

const styles = {
  successModal: {
    width: "250px",
    border: "2px solid rgb(22, 170, 22)",
    borderRadius: "0.3rem",
  },
  successModalTitle: {
    fontSize: "2rem",
    textAlign: "center",
    background: "rgb(22, 170, 22)",
    borderRadius: "0.2rem 0.2rem 0 0",
  },
  successModalBody: {
    display: "flex",
    height: "200px",
    color:" rgb(22, 170, 22)",
    background: "rgb(227, 250, 227)",
  },
  successModalBodyIcon: {
    margin: "auto",
    fontSize: "6rem",
  },
}

const SuccessModal = ({ show, onRequestClose}) => (
  <Modal
    isOpen={show}
    onRequestClose={onRequestClose}
    style={baseModalStyle}
    contentLabel="appointmentSuccess"
    ariaHideApp={false}
  >
    <div style={styles.successModal}>
      <div style={styles.successModalTitle}>Запись создана</div>
      <div style={styles.successModalBody}>
        <i style={styles.successModalBodyIcon} className="large material-icons">check_circle</i>
      </div>
    </div>
  </Modal>
);

export default SuccessModal;
