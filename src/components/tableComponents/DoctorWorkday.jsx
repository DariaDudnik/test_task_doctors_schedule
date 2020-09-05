import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Moment from 'react-moment';
import AppModal from './AppModal';
import { setCurrentDoctor } from '../../redux/actions/doctorsActions';
import { appointmentTypes } from '../../redux/constants/constants';

const hour = 60;

const slotCaptions = {
  [appointmentTypes.STUDY]: 'Обучение',
  [appointmentTypes.PAPERWORK]: 'Работа с документами',
  [appointmentTypes.OFF]: 'Врач не работает',
  [appointmentTypes.NOAPP]: 'Врач не принимает',
}

const AppointmentTime = (props) => {
  const { fillStatus, startMoment } = props;
  const { showModal, rangeString } = props;

  const handleClick = (appointment) => () => showModal({
    startMoment,
    rangeString,
    fillStatus: appointment,
    appointmentCount: fillStatus.length,
  });

  const isAvailable = fillStatus.length < 2;

  if (!fillStatus.length) {
    return (
      <div className={`schedule-day__time ${isAvailable ? 'schedule-day__time_available' : ''}`} onClick={handleClick(null)}>
        {startMoment.format("HH:mm")}
      </div>
    );
  }

  const fillContent = fillStatus.map((slot, index) => {
    if(slot.appointmentType === appointmentTypes.PATIENT) {
      const shortName = slot.patient.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ');
      const shortDate = moment(slot.date).format("HH:mm")
      return (
        <div
          key={index}
          className={`schedule-day__time schedule-table-time-box__appointment  ${isAvailable ? 'schedule-day__time_available' : ''}`}
          onClick={handleClick(slot)}
        >
          {shortDate} {shortName}
        </div>);
    }

    return (<div key={index} className="schedule-day__activity-secondary">
      {slotCaptions[slot.appointmentType] || ":"}
    </div>);
  });

  return (
    <div className="schedule-table-time-box">
      {fillContent}
    </div>
  );
}

const DoctorWorkday = ({ doctor, day }) => {
  const [modalData, setModalData] = useState(null);
  const dispatch = useDispatch();

  const timeRange = parseInt(doctor.end, 10) - parseInt(doctor.start, 10);
  const intervalMinutes = timeRange * hour;
  const appointmentsNumber = intervalMinutes / parseInt(doctor.interval, 10);
  const appointmentSlots = [];

  const [ startHours, startMinutes ] = doctor.start.split(':').map(x => Number.parseInt(x, 10));
  const start = startHours * hour + startMinutes;
  for (let i = 0; i < appointmentsNumber; i++) {
    const cur = start + doctor.interval * i;
    const curHours = Math.floor(cur / 60);
    const curMins = cur % 60;
    const curMinsString = ('0'+curMins).substr(-2);

    const next = cur + doctor.interval;
    const nextHours = Math.floor(next / 60);
    const nextMins = next % 60;
    const nextMinsString = ('0'+nextMins).substr(-2);

    const periodStartMoment = moment(day);
    periodStartMoment.set('hour', curHours);
    periodStartMoment.set('minute', curMins);

    const fillStatus =  doctor.appointments.filter(app => { 
      if(app.appointmentType === appointmentTypes.PATIENT && app.date){
        return moment(app.date).isSame(periodStartMoment);
      }

      if(app.appointmentType === appointmentTypes.STUDY || app.appointmentType === appointmentTypes.PAPERWORK) {
        const timeFrom = moment(day).isoWeekday(app.dayFrom);
        const timeTo = moment(day).isoWeekday(app.dayTo);
        const isCurDay = moment(day).isBetween(timeFrom, timeTo, undefined, '[]');

        if(isCurDay) {
          const currentDayFrom = moment(day).hours(app.timeFrom.substring(0,2)).minutes(app.timeFrom.substring(0,-2));
          const currentDayTo = moment(day).hours(app.timeTo.substring(0,2)).minutes(app.timeTo.substring(0,-2));
          const isTime = moment(periodStartMoment).isBetween(currentDayFrom, currentDayTo, undefined, '[]');
          return isTime;
        }
        return moment(app.date).isSame(periodStartMoment);
      }
      return false;
    });

    appointmentSlots.push({
      time: `${curHours}:${curMinsString}`,
      rangeString: `${curHours}:${curMinsString}-${nextHours}:${nextMinsString}`,
      startMoment: periodStartMoment,
      fillStatus: fillStatus,
    });
  }

  const showModal = modalData => {
    dispatch(setCurrentDoctor(doctor, modalData.startMoment));
    setModalData(modalData);
  };

  const handleClose = useCallback(() => {
    setModalData(null);
  }, [setModalData]);

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
            {doctor.medicalFacility} ({doctor.room})
          </div>
          <div className="schedule-day__activity-body">{doctor.start}-{doctor.end}</div>
        </div>
        <div  className="schedule-day__time">
          {appointmentSlots.map(({ time, rangeString, startMoment, fillStatus }) =>
            <AppointmentTime
              key={rangeString}
              time={time}
              rangeString={rangeString}
              startMoment={startMoment}
              showModal={showModal}
              fillStatus={fillStatus}
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