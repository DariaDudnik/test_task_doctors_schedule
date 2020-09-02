import React, { useState } from 'react';
import Modal from 'react-modal';
import { createAppointment } from '../../redux/actions/doctorsActions';
import { useDispatch, useSelector } from 'react-redux';
import SuccessModal  from './SuccessModal';
import ShowAppModal  from './ShowAppModal';
import CancelAppModal from './CancelAppModal';
import { appointmentTypes } from '../../redux/constants/constants';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  },
  overlay: {
    zIndex: "10"
  },
  modalContainer: {
    color: "darkblue"
  },
  modalHeaderBlock: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  modalHeaderBlockCenter: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  modalHeaderBlockNext: {
    marginRight: "1rem",
    display: "flex"
  },
  modalHeaderBlockNextSpan: {
    textAlign: "center"
  },
  modalBodyBlock: {
    margin: "0 1rem",
    padding: "0.2rem 0",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid grey",
    cursor: "pointer"
  },
  modalBodyBlockInfo: {
    margin: "0 1rem",
    padding: "0.2rem 0",
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  modalBodyBlockInfoData: {
    flex: "1 1 50%"
  },
  modalBodyBlockNextDiv: {
    marginRight: "1rem"
  },
  modalBodyCreateSpan: {
    color: "rgb(103, 171, 212)",
  },
  modalBodyBlockDisabled: {
    color: "grey",
  },
  modalHeaderBlockProfile: {
    marginLeft: "1rem",
  },
  modalBodyCancelSpan: {
    color: "red",
  },
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
  disabled:{
    pointerEvents: "none",
    opacity: "0.7",
    color:  "grey",
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
  textBoldInfo: {
    fontWeight: "bold",
    flex: "1 1 50%"
  }
};

const AppModal = ({ handleClose, show, modalData }) => {
  let data = modalData ? modalData : { 
    startMoment: null,
    rangeString: null,
    fillStatus: null,
  };

  const appointment = {};
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.currentDoctor);
  const selectedDate = useSelector((state) => state.doctors.appointmentDate);
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [openShowAppModal, setShowAppModal] = useState(false);

  appointment.doctor = doctor;
  appointment.doctorId = doctor.id;
  appointment.date = selectedDate;
  appointment.patient = selectedPatient;
  appointment.appointmentType = appointmentTypes.PATIENT;

  const handleAppCreation = () => {
    dispatch(createAppointment(appointment));
    handleClose();
    handleSuccess();
  }

  const handleAppCancellation = () => {
    setShowModalCancel(true);
    handleClose();
  }

  const handleAppShow = () => {
    setShowAppModal(true);
  }

  const handleCloseAppShow = () => {
    setShowAppModal(false);
    handleClose();
  }

  const handleSuccess = () => {
    setShowModalSuccess(true);
    setTimeout(() => setShowModalSuccess(false), 3000);
  }

  const handleSuccessClose = () => {
    setShowModalCancel(false);
  }

  const isDisabledToCreate = !(selectedPatient && (data.fillStatus && data.fillStatus.length <2));
  const isDisabledToCancel = !(data.fillStatus && data.fillStatus[0] && data.fillStatus[0].appointmentType === "PATIENT");

  return (
    <div>
      <Modal
        isOpen={show}
        onRequestClose={handleClose}
        style={customStyles}
        className={""}
        contentLabel="appointmentModal"
        ariaHideApp={false}
      >
        <div className="modal-container">
          <div style={customStyles.modalHeaderBlock}>
            <div style={customStyles.modalHeaderBlockNext}><i className="large material-icons">access_time</i></div>
            <span style={customStyles.modalHeaderBlockNextSpan}>Выбран интервал времени<br />{data.rangeString}</span>
          </div>
          <div style={customStyles.modalBodyBlock} disabled={isDisabledToCancel}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">assignment</i></div>
            <span
            style={isDisabledToCancel ? customStyles.disabled : {}}
            onClick={handleAppShow}
            > 
            Просмотреть запись
            </span>
          </div>
          <div style={customStyles.modalBodyBlock} disabled={isDisabledToCreate}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">create</i></div>
            <span
              style={isDisabledToCreate ? customStyles.disabled : customStyles.modalBodyCreateSpan}
              onClick={handleAppCreation}
              >
                Создать запись
            </span>
            </div>
          <div style={customStyles.modalBodyBlock} disabled={isDisabledToCancel}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">delete</i></div>
            <span
              style={isDisabledToCancel ? customStyles.disabled : customStyles.modalBodyCancelSpan}
              onClick={handleAppCancellation}
              >
                Отменить запись
                </span>
            </div>
        </div>
      </Modal>

      <SuccessModal
        show={showModalSuccess}
        onRequestClose={handleSuccessClose}
        style={customStyles}
        ariaHideApp={false}
      />
      <ShowAppModal
        openShowAppModal={openShowAppModal}
        onRequestClose={handleCloseAppShow}
        style={customStyles}
        modalData={modalData}
      />
      <CancelAppModal
        showModalCancel={showModalCancel}
        onRequestClose={handleClose}
        handleSuccessClose={handleSuccessClose}
        style={customStyles}
      />
    </div>
  )
};

export default AppModal;
