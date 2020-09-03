import React, { memo, useMemo } from "react";
import DoctorLine from "./DoctorLine";

const GroupedByTypeList =({ data, name, handleDoctorSelect, handleAllCheckByType }) => {
 

  const Group = ({ list, name }) => {
    const allChecked = useMemo(() => list.every(item => item.checked), [list]);
    const childrenIds = useMemo(() => list.map(item => item.id), [list]);

    return (
      <label htmlFor="category" className="leftbar-list__category-label">
        <div className="text-left">
          <input
            type='checkbox'
            name="doctors-check"
            className="doctors-checkbox-name"
            checked={allChecked}
            onChange={() => handleAllCheckByType(childrenIds, !allChecked)}
          />
          <span className="p-3 d-inline-block">{name}</span>
        </div>
        {
          list && list.map(doctor => (
            <DoctorLine key={doctor.id} doctor={doctor} handleDoctorSelect={handleDoctorSelect} />
          ))
        }
      </label>
    );
  }

  return (<Group list={data} name={name}/>)
}

export default memo(GroupedByTypeList);