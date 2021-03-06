import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import momentBase from 'moment';
import 'moment/locale/ru';
import { extendMoment } from 'moment-range';
import WeekdayGroup from './WeekdayGroup';
import HeadGroup from "./HeadGroup";
import DocFacade from "../../utils/DocFacade";

const moment = extendMoment(momentBase);

const Schedule = () => {
  const timeRangeFrom = useSelector((state) => state.schedule.timeRangeFrom);
  const timeRangeTo = useSelector((state) => state.schedule.timeRangeTo);

  const daysRange = useMemo(() => {
    const range =  moment.range(timeRangeFrom, timeRangeTo);

    return Array.from(range.by('day'));
  }, [timeRangeFrom, timeRangeTo]);

  const doctors = useSelector(state => state.doctors.doctorsList);
  const selectedDoctors = useMemo(() => doctors.filter(d => d.checked), [doctors]);

  const docSchedules = useMemo(() => {
    return daysRange.map(day => {
      const allDocsSchedules = doctors
        .filter(doc => doc.checked)
        .map(doc => ({
          doctor: doc,
          schedule: DocFacade.makeDaySchedule(doc, day),
        }))
        .filter(({ schedule }) => !!schedule && schedule.hasAppointmentSlots);

      return {
        day,
        allDocsSchedules,
      };
    });
  }, [daysRange, doctors]);

  const areNonEmpty = docSchedules.some(({ allDocsSchedules }) => {
    return allDocsSchedules.some(({ schedule }) => schedule.hasAppointmentSlots);
  });

  let content;
  if (!selectedDoctors.length) {
    content = (<div className="empty-data">
      Для просмотра расписания выберите хотя бы один Доступный ресурс
    </div>);
  } else if (areNonEmpty) {
    let heads = docSchedules.map(({ day, allDocsSchedules }) => (
      <HeadGroup key={day.format('MMM Do YY')} day={day} schedules={allDocsSchedules} />
    ));
    let tails = docSchedules.map(({ day, allDocsSchedules })  =>
      <WeekdayGroup key={day.format('MMM Do YY')} day={day} schedules={allDocsSchedules} />);
    content = (<React.Fragment>
      <div className="d-flex flex-row justify-content-start">
        {heads}
      </div>
      <div className="container-of-containers">
        {tails}
      </div>
    </React.Fragment>);
  } else {
    content =(<div className="empty-data">
      На выбранный период отсутствуют свободные временные интервалы для записи. Выберите другой период
    </div>)
  }

  return (
    <div className={"scroll-container " + (areNonEmpty ? 'justify-content-start' : '')}>
      {content}
    </div>
  )
}

export default React.memo(Schedule);
