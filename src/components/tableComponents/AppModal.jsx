import React, { useState, useCallback } from 'react';
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
  const appointment = {};
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.currentDoctor);
  const selectedDate = useSelector((state) => state.doctors.appointmentDate);
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAppModalOpen, setShowAppModalOpen] = useState(false);

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

  const handleAppCancellation = () => setShowCancelModal(true);

  const handleAppShow = () => {
    setShowAppModalOpen(true);
  };

  const handleCloseAppShow = () => {
    setShowAppModalOpen(false);
    handleClose();
  };

  const handleSuccess = () => {
    setShowModalSuccess(true);
    handleClose();
    setTimeout(() => {
      handleSuccessClose();
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowModalSuccess(false);
  };

  const closeCancelModal = useCallback(() => {
    setShowCancelModal(false);
    handleClose();
  }, [setShowCancelModal, handleClose]);

  let mainModal;
  if (modalData && !showCancelModal && !showModalSuccess && !showAppModalOpen) {
    const canCreate = selectedPatient && modalData.appointmentCount < 2;
    const isApppointment = modalData.fillStatus && modalData.fillStatus.appointmentType === "PATIENT";

    const modalHeader =
    isApppointment ? (
      <React.Fragment>
        <div style={customStyles.modalHeaderBlockNext}><i className="large material-icons">person_pin</i></div>
        <span style={customStyles.modalHeaderBlockNextSpan}>{modalData.fillStatus.patient.name}</span>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div style={customStyles.modalHeaderBlockNext}><i className="large material-icons">access_time</i></div>
        <span style={customStyles.modalHeaderBlockNextSpan}>Выбран интервал времени<br />{modalData.rangeString}</span>
      </React.Fragment>
    );

    mainModal = (<Modal
        isOpen={show}
        onRequestClose={handleClose}
        style={customStyles}
        className={""}
        contentLabel="appointmentModal"
        ariaHideApp={false}
      >
        <div className="modal-container">
          <div style={customStyles.modalHeaderBlock}>
            {modalHeader}
          </div>
          <div style={customStyles.modalBodyBlock} disabled={!isApppointment}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">assignment</i></div>
            <span
              style={!isApppointment ? customStyles.disabled : {}}
              onClick={handleAppShow}
            > 
              Просмотреть запись
            </span>
          </div>
          <div style={customStyles.modalBodyBlock} disabled={!canCreate}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">create</i></div>
            <span
              style={canCreate ? customStyles.modalBodyCreateSpan : customStyles.disabled}
              onClick={handleAppCreation}
              >
                Создать запись
            </span>
          </div>
          <div style={customStyles.modalBodyBlock} disabled={!isApppointment}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">delete</i></div>
            <span
              style={isApppointment ? customStyles.modalBodyCancelSpan : customStyles.disabled}
              onClick={handleAppCancellation}
            >
              Отменить запись
            </span>
          </div>
        </div>
      </Modal>);
  }

  return (
    <div>
      {mainModal}
      <SuccessModal
        show={showModalSuccess}
        onRequestClose={handleSuccessClose}
        style={customStyles}
        ariaHideApp={false}
      />
      <ShowAppModal
        showAppModalOpen={showAppModalOpen}
        onRequestClose={handleCloseAppShow}
        style={customStyles}
        modalData={modalData}
      />
      <CancelAppModal
        showCancelModal={showCancelModal}
        onRequestClose={closeCancelModal}
        style={customStyles}
        appointment={modalData && modalData.fillStatus}
      />
    </div>
  )
};

export default React.memo(AppModal);
