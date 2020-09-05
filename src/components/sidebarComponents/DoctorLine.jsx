import React, { memo } from 'react';


const DoctorLine = ({ doctor: { id, name, checked, room, type }, handleDoctorSelect, listType }) => (
  <label className="d-block">
    <hr className="doctor-list-item" />
    <li className="leftbar-list__category-item">
      <input
        id="category"
        type="checkbox"
        name={id}
        key={id}
        form="doctors-check"
        className="doctors-checkbox-name"
        checked={checked}
        onChange={() => handleDoctorSelect(id)}
      />
      <span>{name}{listType ? `(${type}, ${room})` : ''}</span>
    </li>
  </label>
)

export default memo(DoctorLine);
