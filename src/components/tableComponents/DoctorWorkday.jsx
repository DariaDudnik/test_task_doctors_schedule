import React, { memo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Moment from 'react-moment';
import AppModal from './AppModal';
import { setCurrentDoctor } from '../../redux/actions/doctorsActions';
import { appointmentTypes } from '../../redux/constants/constants';

const slotCaptions = {
  [appointmentTypes.STUDY]: 'Обучение',
  [appointmentTypes.PAPERWORK]: 'Работа с документами',
  [appointmentTypes.OFF]: 'Врач не работает',
  [appointmentTypes.NOAPP]: 'Врач не принимает',
}

const AppointmentTime = memo((props) => {
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);

  const { fillStatus, fillType } = props;
  const { showModal, startMoment, rangeString } = props;

  const handleClick = (patient) => () => showModal({
    startMoment,
    rangeString,
    patient,
    appointmentCount: fillStatus.length,
  });

  let tooltipMessage = 'Время доступно для записи';
  let isAvailable = fillStatus.length < 2 &&
    (!selectedPatient || fillStatus.every(app => !app.patient || app.patient.id !== selectedPatient.id));

  if (isAvailable && startMoment < moment().add(30, 'minutes')) {
    isAvailable = false;
    tooltipMessage = 'Запись на прошедший временной интервал недоступна';
  }

  let content;
  if (fillType === appointmentTypes.PATIENT) {
    if (!fillStatus.length) {
      content = (
        <div
          className={`appointment-tooltip schedule-day__time-row schedule-table-time-box__appointment ${isAvailable ? 'schedule-day__time-row_available' : ''}`}
          onClick={handleClick(null)}
        >
          {startMoment.format("HH:mm")}
          <span className="appointment-tooltip__text">{tooltipMessage}</span>
        </div>
      );
    } else {
      const nameWitdh = { width: `calc((100% - 46px)/${fillStatus.length})`};
      const patients = fillStatus.map(({ patient }) => {
        const text = patient.name.split(/\s+/)
          .map((word, idx) => idx === 0 ? `${word} ` : `${word[0]}.`)
          .join('');
        return (<div
          key={`${patient.id}`}
          style={nameWitdh}
          className={`appointment-tooltip schedule-day__time-row schedule-table-time-box__appointment  ${isAvailable ? 'schedule-day__time-row_available' : ''}`}
          onClick={handleClick(patient)}
        >
          <div className="patient-name">{text}</div>
          <span className="appointment-tooltip__text">{`${rangeString} ${patient.name}`}</span>
        </div>)
      })
      content = (<React.Fragment>
        <div className="schedule-day__time-row">{startMoment.format('HH:mm')}</div>
        {patients}
      </React.Fragment>)
    }
  } else {
    content = (<div className="schedule-day__activity-secondary">
      {rangeString} <br />
      {slotCaptions[fillType] || ":"}
    </div>);
  }

  return (
    <div className="schedule-table-time-box">
      {content}
    </div>
  );
});

const DoctorWorkday = ({ doctor, day, schedule }) => {
  const [modalData, setModalData] = useState(null);
  const dispatch = useDispatch();

  const showModal = modalData => {
    console.log('showModal, doc, start', doctor, modalData.startMoment);
    dispatch(setCurrentDoctor(doctor, modalData.startMoment));
    setModalData(modalData);
  };

  const handleClose = useCallback(() => {
    setModalData(null);
  }, [setModalData]);

  const { timeFrom, timeTo } = doctor.contract.workDay;
  const startTime = moment().set({ h: timeFrom[0], m: timeFrom[1] })
    .format('HH:mm');
  const endTime = moment().set({ h: timeTo[0], m: timeTo[1] })
    .format('HH:mm');

  return (
    <div >
      <article className="main-container__schedule-day">
        <div  className="schedule-day__date"><Moment locale="ru" format="ddd. DD MMM" date={day} /></div>
        <div className="schedule-day__person">
          <div className="schedule-day__person-name">{doctor.name}</div>
          <div className="schedule-day__person-position">{doctor.type}</div>
        </div>

        <div className="schedule-day__activity-main">
          <div className="schedule-day__activity-title">
            {doctor.medicalFacility} ({doctor.contract.room})
          </div>
          <div className="schedule-day__activity-body">{startTime}-{endTime}</div>
        </div>
        <div  className="schedule-day__time">
          {schedule.map((slot) =>
            <AppointmentTime
              key={slot.rangeString}
              showModal={showModal}
              {...slot}
            />
          )}
        </div>
      </article>
      <AppModal
        show={modalData !== null}
        handleClose={handleClose}
        modalData={modalData}
      />
    </div>
  );
}

export default memo(DoctorWorkday);
