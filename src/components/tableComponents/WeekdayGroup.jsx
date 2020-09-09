import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import DoctorWorkday from './DoctorWorkday';
import DocFacade from "../../utils/DocFacade";

const WeekdayGroup = ({ day }) => {
  const doctors = useSelector(state => state.doctors.doctorsList);

  const docSchedules = useMemo(() => {
    return doctors
      .filter(doc => doc.checked)
      .map(doc => ({
        doctor: doc,
        schedule: DocFacade.makeDaySchedule(doc, day),
      }))
      .filter(({ schedule }) => !!schedule && schedule.hasAppointmentSlots);
  }, [day, doctors]);

  return <div className="main-container__schedule">
    {docSchedules.map(({ doctor, schedule }) => (
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
