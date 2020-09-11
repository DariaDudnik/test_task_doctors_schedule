import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Moment from 'react-moment';
import AppModal from '../Modals/AppModal';
import { setCurrentDoctor } from '../../../redux/actions/doctorsActions';
import ScheduleSlot from "./ScheduleSlot";

const DoctorWorkday = ({ doctor, day, schedule }) => {
  const [modalData, setModalData] = useState(null);
  const dispatch = useDispatch();

  const showModal = modalData => {
    dispatch(setCurrentDoctor(doctor, modalData.startMoment));
    setModalData(modalData);
  };

  const handleClose = useCallback(() => {
    setModalData(null);
  }, [setModalData]);

  const { interval } = doctor.contract;

  return (
    <div>
      <article className="main-container__schedule-day">
        <div  className="schedule-day__time">
          {schedule.map((slot) =>
            <ScheduleSlot
              key={slot.rangeString}
              showModal={showModal}
              interval={interval}
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
