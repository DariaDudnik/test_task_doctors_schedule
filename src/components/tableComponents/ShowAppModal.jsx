import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import moment from 'moment';

const ShowAppModal = ({ showAppModalOpen, onRequestClose, modalData, style }) => {
  const currentDoctor = useSelector(state => state.doctors.currentDoctor);

  if (!modalData || !modalData.fillStatus) {
    return null;
  }

  const patientInfo = modalData.fillStatus;
  const roomNumber = currentDoctor.room ? currentDoctor.room.slice(2) : '';

  return (
    <Modal
      isOpen={showAppModalOpen}
      style={style}
      onRequestClose={onRequestClose}
      contentLabel="appointmentCancel"
      ariaHideApp={false}
    >
      <div style={style.modalContainer}>
        <div style={style.modalHeaderBlockCenter}>
          <div style={style.modalHeaderBlockNext}>
            <i className="large material-icons">assignment</i>
            <span style={style.modalHeaderBlockNextSpan}>{patientInfo.patient.name}</span>
          </div>
        </div>
        <div style={style.modalBodyBlockInfo}>
          <div style={style.textBoldInfo}>Дата:&ensp;</div>
          <div style={style.modalBodyBlockInfoData}>{moment(patientInfo.date).format("DD.MM.YYYY")}</div>
        </div>
        <div style={style.modalBodyBlockInfo}>
          <div style={style.textBoldInfo}>Врач:&ensp;</div>
          <div style={style.modalBodyBlockInfoData}>{currentDoctor.name}</div>
        </div>
        <div style={style.modalBodyBlockInfo}>
          <div style={style.textBoldInfo}>Кабинет:&ensp;</div>
          <div style={style.modalBodyBlockInfoData}>{roomNumber}</div>
        </div>
        <div style={style.modalBodyBlockInfo}>
          <div style={style.textBoldInfo}>Полис ОМС:&ensp;</div>
          <div style={style.modalBodyBlockInfoData}>{patientInfo.patient.healthInsuranceNumber}</div>
        </div>
      </div>
    </Modal>
  )
};
export default ShowAppModal;
