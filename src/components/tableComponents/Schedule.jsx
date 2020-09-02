import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import momentBase from 'moment';
import 'moment/locale/ru';
import { extendMoment } from 'moment-range';
import WeekdayGroup from './WeekdayGroup';

const moment = extendMoment(momentBase);

const Schedule = () => {
  const timeRangeFrom = useSelector((state) => state.schedule.timeRangeFrom);
  const timeRangeTo = useSelector((state) => state.schedule.timeRangeTo);
  const selectedDate = useSelector((state) => state.schedule.currentDate);
  const selectedDoctors = useSelector((state) => state.doctors.selectedDoctors);

  const daysRange = useMemo(() => {
    const range =  moment.range(timeRangeFrom, timeRangeTo);

    return Array.from(range.by('day'));
  }, [timeRangeFrom, timeRangeTo]) ;

  const content = (selectedDoctors || selectedDate)
    ? daysRange.map(day =>
      <WeekdayGroup key={day.format('MMM Do YY')} day={day} />)
    : (<div className="empty-data">
        Для просмотра расписания выберите хотя бы один Доступный ресурс
      </div>);

  return (
    <div className="scroll-container">
      {content}
    </div>
  )
}

export default React.memo(Schedule);
