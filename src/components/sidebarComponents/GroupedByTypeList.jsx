import React, { memo, useMemo } from "react";
import DoctorLine from "./DoctorLine";

const GroupedByTypeList =({ data, name, handleDoctorSelect, handleAllCheckByType }) => {
 

  const Group = ({ list, name }) => {
    const allChecked = useMemo(() => list.every(item => item.checked), [list]);
    const childrenIds = useMemo(() => list.map(item => item.id), [list]);

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
          list && list.map(doctor => (
            <DoctorLine key={doctor.id} doctor={doctor} handleDoctorSelect={handleDoctorSelect} />
          ))
        }
      </div>
    );
  }

  return (<Group list={data} name={name}/>)
}

export default memo(GroupedByTypeList);