import React, { memo, useMemo } from "react";
import DoctorLine from "./DoctorLine";

const GroupedByTypeList =({ doctors, name, handleDoctorSelect, handleAllCheckByType }) => {
  const allChecked = useMemo(() => doctors.every(item => item.checked), [doctors]);
  const childrenIds = useMemo(() => doctors.map(item => item.contract.id), [doctors]);

  console.log('childrenIds', childrenIds);

  return (
    <div className="leftbar-list__category-label">
      <div
        onClick={() => handleAllCheckByType(childrenIds, !allChecked)}
        className="text-left"
      >
        <input
          readOnly
          type='checkbox'
          className="doctors-checkbox-name"
          checked={allChecked}
        />
        <span className="p-3 d-inline-block">{name}</span>
      </div>
      {
        doctors && doctors.map(doctor => (
          <DoctorLine key={doctor.contract.id} doctor={doctor} handleDoctorSelect={handleDoctorSelect} />
        ))
      }
    </div>
  );
}

export default memo(GroupedByTypeList);
