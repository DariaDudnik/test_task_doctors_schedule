import React from 'react';
import Modal from 'react-modal';
import {useDispatch, useSelector} from 'react-redux';
import { cancelAppointment } from '../../../redux/actions/doctorsActions';
import baseModalStyle from "./baseModalStyle";

const styles = {
  declineModal:{
    width: "250px",
    border: "1px solid grey",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  declineModalTitle:{
    display: "flex",
    marginBottom: "2rem",
    alignSelf: "center",
    alignItems: "center",
  },
  declineModalTitleIcon: {
    color: "red",
    marginRight: "0.5rem",
  },
  declineModalText: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  declineModalButton: {
    background: "red",
    color: "white",
    borderRadius: "0.5rem",
    border: "1px solid grey",
    marginBottom: "2rem",
    padding: "0.5rem",
    width: "50%",
    alignSelf: "center",
  },
  declineModalBackLink: {
    textDecoration: "underline",
    textAlign: "center",
  },
};

const CancelAppModal = ({ showCancelModal, onRequestClose, patient }) => {
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.currentDoctor);
  const selectedDate = useSelector((state) => state.doctors.appointmentDate);

  const confirmCancellation = () => {
    dispatch(cancelAppointment({
      doctor,
      patient: patient,
      date: selectedDate,
    }));
    onRequestClose();
  }

  return (
    <Modal
      isOpen={showCancelModal}
      style={baseModalStyle}
      onRequestClose={onRequestClose}
      contentLabel="appointmentCancel"
      ariaHideApp={false}
    >
      <div style={styles.declineModal}>
        <div style={styles.declineModalTitle}>
          <i style={styles.declineModalTitleIcon} className="large material-icons">error</i>
          <span>Отмена записи</span>
        </div>
        <div style={styles.declineModalText}>
          Врач и пациент будут уведомлены об отмене записи.
        </div>
        <button
          style={styles.declineModalButton}
          onClick={confirmCancellation}
        >
          Отменить
        </button>
        <div style={styles.declineModalBackLink} onClick={onRequestClose}>Вернуться к расписанию</div>
      </div>
    </Modal>
  )
};
export default React.memo(CancelAppModal);
