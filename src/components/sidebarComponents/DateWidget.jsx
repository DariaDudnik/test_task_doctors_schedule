import React, {useState, useEffect, useMemo} from 'react';
import DocFacade from "../../utils/DocFacade";
import momentBase from 'moment';
import { extendMoment } from 'moment-range';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import "react-datepicker/dist/";
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
import addMonths from 'date-fns/addMonths'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { selectDate, toggleCalendar } from '../../redux/actions/scheduleActions';

const moment = extendMoment(momentBase);
registerLocale('ru', ru);

const DateWidget = () => {
  const storeDate = useSelector(state => state.schedule.currentDate);
  const checkedDoctors = useSelector(state => state.doctors.doctorsList.filter(doc => doc.checked));
  const datePickerIsOpen = useSelector(state => state.schedule.datePickerIsOpen);
  const haveCheckedDoctors = useSelector(state => state.doctors.doctorsList.some(doc => doc.checked));
  const dispatch = useDispatch();

  const [ selectedDate, setSelectedDate ] = useState(storeDate);

  useEffect(() => {
    setSelectedDate(storeDate);
  }, [storeDate]);

  const highlightedDays = useMemo(() => {
    const rangeEnd = moment(storeDate).add(14, 'days');

    const range =  moment.range(storeDate, rangeEnd);
    const days = Array.from(range.by('day'));

    return days.filter(day => {
      return checkedDoctors.some(doc => {
        const schedule = DocFacade.makeDaySchedule(doc, day);
        return schedule && schedule.hasAppointmentSlots;
      });
    }).map(m => m.toDate());
  }, [storeDate, checkedDoctors]);

  const handleToggle = () => {
    if (!haveCheckedDoctors) {
      return;
    }

    dispatch(toggleCalendar(!datePickerIsOpen));
  }

  const highlightWithRanges = [
    {
      'react-datepicker__day--highlight-appointments': highlightedDays,
    },
  ];

  const handleOk = () => {
    dispatch(selectDate(selectedDate));
    dispatch(toggleCalendar(false));
  }

  const handleCancel = () => {
    setSelectedDate(storeDate);
    dispatch(toggleCalendar(false));
  }

  return (
    <div className="left-bar-container__block">
      <div className="left-bar-container__block__top">
        <h5 className="leftbar-title">Дата записи</h5>
      </div>
      <div className="input-group left-bar-container__block__bottom">
        <DatePicker
          dateFormat="dd/MM/yyyy"
          disabledKeyboardNavigation
          selected={selectedDate}
          onChange={setSelectedDate}
          minDate={new Date()}
          maxDate={addMonths(new Date(), 5)}
          dropdownMode="select"
          placeholderText='ДД.ММ.ГГГГ'
          locale='ru'
          showDisabledMonthNavigation
          className="search-bar-date-calendar"
          open={datePickerIsOpen}
          onBlur={handleCancel}
          disabled={!haveCheckedDoctors}
          highlightDates={highlightWithRanges}
        >
          <div className="pb-2">
            <button className="btn btn-secondary btn-sm mr-3" onClick={handleCancel}>
              <FontAwesomeIcon icon={faTimes} />
              Отменить
            </button>
            <button className="btn btn-success btn-sm" onClick={handleOk}>
              <FontAwesomeIcon icon={faCheck} />
              Ок
            </button>
          </div>
        </DatePicker>
        <div className="datepicker-tooltip">
          <button
            disabled={!haveCheckedDoctors}
            className="btn btn-secondary search-bar-date-icon"
            size="sm"
            onClick={handleToggle}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </button>
          {!haveCheckedDoctors && (
            <span className="datepicker-tooltip__text">
              Выберите доступный ресурс
            </span>)
          }
        </div>
      </div>
    </div>
  );
};

export default DateWidget;

