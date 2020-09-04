import React, { memo } from 'react';


const DoctorLine = ({ doctor: { id, name, checked, room, type }, handleDoctorSelect, listType }) => (
  <div onClick={() => handleDoctorSelect(id)}>
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
      />
      {listType ? <span>{name}({type}, {room})</span> : <span>{name}</span>}
    </li>
  </div>
)

export default memo(DoctorLine);