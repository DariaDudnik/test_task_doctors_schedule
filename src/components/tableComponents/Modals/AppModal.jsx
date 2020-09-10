import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { createAppointment } from '../../../redux/actions/doctorsActions';
import { useDispatch, useSelector } from 'react-redux';
import SuccessModal  from './SuccessModal';
import ShowAppModal  from './ShowAppModal';
import CancelAppModal from './CancelAppModal';
import baseModalStyle from "./baseModalStyle";

const customStyles = {
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
  textBoldInfo: {
    fontWeight: "bold",
    flex: "1 1 50%"
  },
  disabled:{
    pointerEvents: "none",
    opacity: "0.7",
    color:  "grey",
  },
};

const AppModal = ({ handleClose, show, modalData }) => {
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.doctors.currentDoctor);
  const selectedDate = useSelector((state) => state.doctors.appointmentDate);
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAppModalOpen, setShowAppModalOpen] = useState(false);

  const handleAppCreation = () => {
    dispatch(createAppointment({
      doctor,
      date: selectedDate,
      patient: selectedPatient
    }));
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
    const isAppointment = !!modalData.patient;

    const interval = doctor.contract.interval;

    const isEnoughTime = selectedDate > moment().add(interval, 'minutes');

    const canCreate = selectedPatient && modalData.appointmentCount < 2 &&
      (!isAppointment || selectedPatient.id !== modalData.patient.id) && isEnoughTime;

    const cancelText = isEnoughTime ? 'Отменить запись' : 'Нельзя отменить запись';

    const modalHeader =
    isAppointment ? (
      <React.Fragment>
        <div style={customStyles.modalHeaderBlockNext}><i className="large material-icons">person_pin</i></div>
        <span style={customStyles.modalHeaderBlockNextSpan}>{modalData.patient.name}</span>
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
        style={baseModalStyle}
        className={""}
        contentLabel="appointmentModal"
        ariaHideApp={false}
      >
        <div className="modal-container">
          <div style={customStyles.modalHeaderBlock}>
            {modalHeader}
          </div>
          <div style={customStyles.modalBodyBlock}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">assignment</i></div>
            <span
              style={!isAppointment ? customStyles.disabled : {}}
              onClick={handleAppShow}
            >
              Просмотреть запись
            </span>
          </div>
          <div style={customStyles.modalBodyBlock}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">create</i></div>
            <span
              style={canCreate ? customStyles.modalBodyCreateSpan : customStyles.disabled}
              onClick={handleAppCreation}
              >
                Создать запись
            </span>
          </div>
          <div style={customStyles.modalBodyBlock}>
            <div style={customStyles.modalBodyBlockNextDiv}><i className="large material-icons">delete</i></div>
            <span
              style={(isAppointment && isEnoughTime) ? customStyles.modalBodyCancelSpan : customStyles.disabled}
              onClick={handleAppCancellation}
            >
              {cancelText}
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
        patient={modalData && modalData.patient}
      />
    </div>
  )
};

export default React.memo(AppModal);
