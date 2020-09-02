import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import DoctorWorkday from './DoctorWorkday';
import moment from 'moment';

const WeekdayGroup = ({ day }) => {
  const doctors = useSelector(state => state.doctors.doctorsList);

  const workingDoctors = useMemo(() => {
    if (!doctors) {
      return [];
    }

    const checkedDoctors = doctors.filter(d => d.checked);
    const selectedDoctors = checkedDoctors.length ? checkedDoctors : doctors;

    return selectedDoctors.filter((doctor) => {
      const workWeekFrom = moment(day).isoWeekday(doctor.workWeekStart);
      const workWeekEnd = moment(day).isoWeekday(doctor.workWeekEnd);

      const isWorkingDay = moment(day).isBetween(workWeekFrom, workWeekEnd, undefined, '[]');

      return isWorkingDay;
    })
  }, [day, doctors]);

  return <div className="main-container__schedule">
    {workingDoctors.map(doctor => (
      <DoctorWorkday doctor={doctor} day={day} key={doctor.id} />
    ))}
  </div>
}

export default memo(WeekdayGroup);