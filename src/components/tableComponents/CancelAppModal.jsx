import React from 'react';
import { cancelAppointment } from '../../redux/actions/doctorsActions';
import Modal from 'react-modal';
import {useDispatch, useSelector} from 'react-redux';

const CancelAppModal = ({ showCancelModal, onRequestClose, style, patient }) => {
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
      style={style}
      onRequestClose={onRequestClose}
      contentLabel="appointmentCancel"
      ariaHideApp={false}
    >
      <div style={style.declineModal}>
        <div style={style.declineModalTitle}>
          <i style={style.declineModalTitleIcon} className="large material-icons">error</i>
          <span>Отмена записи</span>
        </div>
        <div style={style.declineModalText}>
          Врач и пациент будут уведомлены об отмене записи.
        </div>
        <button
          style={style.declineModalButton}
          onClick={confirmCancellation}
        >
          Отменить
        </button>
        <div style={style.declineModalBackLink} onClick={onRequestClose}>Вернуться к расписанию</div>
      </div>
    </Modal>
  )
};
export default React.memo(CancelAppModal);
