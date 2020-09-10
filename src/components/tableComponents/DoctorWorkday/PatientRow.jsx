import React from "react";

export const PatientRow = ({ patient, date, rangeString, nameWidth, handleClick, isAvailable }) => {
  const text = patient.name.split(/\s+/)
    .map((word, idx) => idx === 0 ? `${word} ` : `${word[0]}.`)
    .join('');
  return (<div
    style={nameWidth}
    className={`appointment-tooltip schedule-day__time-row schedule-table-time-box__appointment  ${isAvailable ? 'schedule-day__time-row_available' : ''}`}
    onClick={handleClick(patient, date)}
  >
    <div className="patient-name">{text}</div>
    <span className="appointment-tooltip__text">{`${rangeString} ${patient.name}`}</span>
  </div>)
};

export default React.memo(PatientRow);
