import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import DoctorsList from './DoctorsList';
import { requestDoctorsList } from '../../redux/actions/doctorsActions';
import { toggleDoctor, toggleAllDoctors, toggleDoctorsByType } from '../../redux/actions/doctorsActions';

const DoctorsWidget = () => {
  const list = useSelector(state => state.doctors.doctorsList);
  const dispatch = useDispatch();
  const [groupedByType, setGroupedByType] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const numberOfCheckedDoctors = useMemo(() => (list && list.filter(x => x.checked).length), [list]);

  useEffect(() => {
    dispatch(requestDoctorsList());
  }, [dispatch]);

  useEffect(() => {
    const isAllChecked = list.every(item => item.checked === true);
    setAllChecked(isAllChecked);
  }, [list])

  const handleDoctorSelect = (contractId) => {
    dispatch(toggleDoctor(contractId));
    setSearchTerm('');
  };

  const handleAllCheck = e => {
    dispatch(toggleAllDoctors(true));
  }

  const handleAllCheckByType = (ids, newVal) => {
    dispatch(toggleDoctorsByType(ids, newVal));
  }
  const handleRemoveCheckAll = e => {
    dispatch(toggleAllDoctors(false));
  }

  const handleSearch = event => {
    const text = event.target.value.toLowerCase();

    const results = list.filter(({ name, type }) =>
      name.toLowerCase().indexOf(text) === 0 ||
      type.toLowerCase().indexOf(text) === 0
    );
    setSearchTerm(text);
    setSearchResults(results);
  };

  let searchItems;
  if (searchTerm < 3) {
    searchItems = '';
  } else if (!searchResults.length) {
    searchItems = <Dropdown.Item>Совпадений не найдено</Dropdown.Item>
  } else {
    searchItems = searchResults.map(doctor => (
      <Dropdown.Item
        key={String(doctor.id)}
        eventKey="1"
        onClick={() => handleDoctorSelect(doctor.contract.id)}
        id={doctor.id}
      >
        {doctor.name}({doctor.type})
      </Dropdown.Item>));
  }

  return (
    <React.Fragment>
      <div className="left-bar-container__block__top">
        <div className="d-flex">
          <h5 className="mr-1 leftbar-title">Специалисты</h5>
          <span>{numberOfCheckedDoctors}/{list.length}</span>
          <div className="dropdown patient-dropdown">
            <button
              className="btn btn-secondary dropdown-toggle patient-button"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="large material-icons">filter_list</i>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item"
                onClick={handleAllCheck}
                disabled={allChecked}
              >
                <FontAwesomeIcon icon={faCheck} />
                Выбрать все
              </button>
              <button className="dropdown-item" href="#"
                onClick={handleRemoveCheckAll}
                disabled={!allChecked}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Отменить все выбранные
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="left-bar-container__block__bottom">
        <div className="custom-input-container">
          <input
            type="search"
            placeholder="Введите текст для поиска"
            onChange={handleSearch}
            value={searchTerm}
          />
          <div className="input-button">
              <span><i className="large material-icons">search</i></span>
          </div>
        </div>
        {searchItems}
        <div className='leftbar-filter-toggler'>
          <button
            onClick={() => setGroupedByType(false)}
            className={`leftbar-filter-toggler__right ${!groupedByType ? 'leftbar-toggler__active' : ''}`}
          >
            По алфавиту
          </button>
          <button
            className={`leftbar-filter-toggler__left ${groupedByType ? 'leftbar-toggler__active' : ''}`}
            onClick={() => setGroupedByType(true)}
          >
            По специальностям
          </button>
        </div>
      </div>
      <div className="leftbar-list">
        <DoctorsList
          doctors={list}
          groupedByType={groupedByType}
          handleDoctorSelect={handleDoctorSelect}
          handleAllCheckByType={handleAllCheckByType}
        />
      </div>
    </React.Fragment>
  );
};

export default DoctorsWidget;
