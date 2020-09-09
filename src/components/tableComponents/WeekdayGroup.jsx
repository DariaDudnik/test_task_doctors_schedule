import React, { memo } from 'react';
import DoctorWorkday from './DoctorWorkday';

const WeekdayGroup = ({ day, schedules }) => {
  return <div className="main-container__schedule">
    {schedules.map(({ doctor, schedule }) => (
      <DoctorWorkday
        key={doctor.contract.id}
        doctor={doctor}
        schedule={schedule}
        day={day}
      />
    ))}
  </div>
}

export default memo(WeekdayGroup);
