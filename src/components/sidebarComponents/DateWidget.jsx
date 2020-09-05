import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import "react-datepicker/dist/";
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
import addMonths from 'date-fns/addMonths'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { selectDate, toggleCalendar } from '../../redux/actions/scheduleActions';

registerLocale('ru', ru);

const DateWidget = () => {
  const selectedDate = useSelector(state => state.schedule.currentDate);
  const datePickerIsOpen = useSelector(state => state.schedule.datePickerIsOpen);
  const haveCheckedDoctors = useSelector(state => state.doctors.doctorsList.some(doc => doc.checked));

  const dispatch = useDispatch();

  const handleToggle = () => {
    if (!haveCheckedDoctors) {
      return;
    }

    dispatch(toggleCalendar(!datePickerIsOpen));
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
          onChange={(e) => dispatch(selectDate(e))}
          minDate={new Date()}
          maxDate={addMonths(new Date(), 5)}
          dropdownMode="select"
          placeholderText='ДД.ММ.ГГГГ'
          locale='ru'
          showDisabledMonthNavigation
          className="search-bar-date-calendar"
          open={datePickerIsOpen}
          onBlur={() => dispatch(toggleCalendar(false))}
          disabled={!haveCheckedDoctors}
        />
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

