import React, { memo } from 'react';


const DoctorLine = ({ doctor: { name, checked, type, contract }, handleDoctorSelect, listType }) => (
  <label className="d-block">
    <hr className="doctor-list-item" />
    <li className="leftbar-list__category-item">
      <input
        id="category"
        type="checkbox"
        name={contract.id}
        key={contract.id}
        form="doctors-check"
        className="doctors-checkbox-name"
        checked={checked}
        onChange={() => handleDoctorSelect(contract.id)}
      />
      <span>{name}{listType ? `(${type}, ${contract.room})` : ''}</span>
    </li>
  </label>
)

export default memo(DoctorLine);
