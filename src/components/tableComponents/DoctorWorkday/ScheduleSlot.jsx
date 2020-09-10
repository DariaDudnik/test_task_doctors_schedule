import React from "react";
import {useSelector} from "react-redux";
import moment from "moment";
import { quotasTypes } from '../../../utils/constants';
import PatientRow from "./PatientRow";

const slotCaptions = {
  [quotasTypes.STUDY]: 'Обучение',
  [quotasTypes.PAPERWORK]: 'Работа с документами',
  [quotasTypes.OFF]: 'Врач не работает',
  [quotasTypes.NOAPP]: 'Врач не принимает',
};

const ScheduleSlot = (props) => {
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);

  const { fillStatus, fillType } = props;
  const { showModal, startMoment, endMoment, rangeString, interval } = props;

  const handleClick = (patient, start) => () => showModal({
    startMoment: start || startMoment,
    rangeString,
    patient,
    appointmentCount: fillStatus.length,
  });

  let tooltipMessage = 'Время доступно для записи';
  let isAvailable = fillStatus.length < 2 &&
    (!selectedPatient || fillStatus.every(app => !app.patient || app.patient.id !== selectedPatient.id));

  if (isAvailable && startMoment < moment().add(interval, 'minutes')) {
    isAvailable = false;
    tooltipMessage = 'Запись на прошедший временной интервал недоступна';
  }

  let content;
  const nameWidth = { width: `calc((100% - 46px)/${fillStatus.length})`};
  if (fillType === quotasTypes.PATIENT) {
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
      const patients = fillStatus.map(({ patient }) => (<PatientRow
        patient={patient}
        key={`${patient.id}`}
        rangeString={rangeString}
        nameWidth={nameWidth}
        handleClick={handleClick}
        isAvailable={isAvailable}
      />));

      content = (<React.Fragment>
        <div className="schedule-day__time-row">{startMoment.format('HH:mm')}</div>
        {patients}
      </React.Fragment>)
    }
  } else if (fillStatus.length) {
    const partBefore = `${startMoment.format('HH:mm')}-${fillStatus[0].startMoment.format('HH:mm')}`;
    const lastAppoinment = fillStatus[fillStatus.length - 1];
    const partAfter = `${lastAppoinment.endMoment.format('HH:mm')}-${endMoment.format('HH:mm')}`;
    return (<React.Fragment>
      <div className="schedule-table-time-box">
        <div className="schedule-day__activity-secondary">
          {partBefore} <br />
          {slotCaptions[fillType] || ":"}
        </div>
      </div>
      <div className="schedule-table-time-box">
        {fillStatus.map(({ patient, startMoment, endMoment }) => (<PatientRow
          date={fillStatus[0].startMoment}
          key={`${patient.id}`}
          patient={patient}
          rangeString={`${startMoment.format('HH:mm')}-${endMoment.format('HH:mm')}`}
          nameWidth={nameWidth}
          handleClick={handleClick}
          isAvailable={false}
        />))}
      </div>
      <div className="schedule-table-time-box">
        <div className="schedule-day__activity-secondary">
          {partAfter} <br />
          {slotCaptions[fillType] || ":"}
        </div>
      </div>
    </React.Fragment>);
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
};

export default React.memo(ScheduleSlot);
