import React, { memo } from 'react';
import DoctorWorkday from './DoctorWorkday';
import Moment from "react-moment";
import moment from "moment";

const DoctorHead = ({ doctor, day }) => {
  const { timeFrom, timeTo } = doctor.contract.workDay;
  const startTime = moment().set({ h: timeFrom[0], m: timeFrom[1] })
    .format('HH:mm');
  const endTime = moment().set({ h: timeTo[0], m: timeTo[1] })
    .format('HH:mm');

  return (
    <article className="header-item">
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
    </article>
  );
}

const HeadGroup = ({ day, schedules }) => {
  return <div className="main-container__schedule main-container__schedule-head">
    {schedules.map(({ doctor }) => (
      <DoctorHead
        key={doctor.contract.id}
        doctor={doctor}
        day={day}
      />
    ))}
  </div>
}

export default memo(HeadGroup);
