import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import moment from 'moment';

const ShowAppModal = ({ showAppModalOpen, onRequestClose, modalData, style }) => {
  const currentDoctor = useSelector(state => state.doctors.currentDoctor);
  const selectedDate = useSelector((state) => state.doctors.appointmentDate);

  if (!currentDoctor || !modalData || !modalData.patient) {
    return null;
  }

  const { patient } = modalData;
  const roomNumber = currentDoctor.contract.room.slice(2) || '';

  return (
    <Modal
      isOpen={showAppModalOpen}
      style={style}
      onRequestClose={onRequestClose}
      contentLabel="appointmentCancel"
      ariaHideApp={false}
    >
      <div style={style.modalContainer}>
        <i className="large material-icons float-right" role="button" onClick={onRequestClose}>close</i>
        <div style={style.modalHeaderBlockCenter}>
          <div style={style.modalHeaderBlockNext}>
            <i className="large material-icons">assignment</i>
            <span style={style.modalHeaderBlockNextSpan}>{patient.name}</span>
          </div>
        </div>
        <div style={style.modalBodyBlockInfo}>
          <div style={style.textBoldInfo}>Дата:&ensp;</div>
          <div style={style.modalBodyBlockInfoData}>{moment(selectedDate).format("DD.MM.YYYY")}</div>
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
          <div style={style.modalBodyBlockInfoData}>{patient.healthInsuranceNumber}</div>
        </div>
      </div>
    </Modal>
  )
};
export default ShowAppModal;
