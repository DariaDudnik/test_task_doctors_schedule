import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import PatientDropdown from './PatientDropdown';
import { useThrottle } from '../../utils/useThrottle';
import {
  requestPatientsList, selectPatient,
} from '../../redux/actions/patientsActions';
import PatientsCard from './PatientsCard';

const SearchWidget = () => {
  const selectedPatient = useSelector((state) => state.patients.selectedPatient);
  const patientList = useSelector((state) => state.patients.patientList);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const throttledFilter = useThrottle((query, patientList) => {
    const lowQuery = query.toLowerCase();
    if (lowQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const filtered = patientList.filter(({ name, healthInsuranceNumber }) =>
      name.toLowerCase().includes(lowQuery) || healthInsuranceNumber.toLowerCase().includes(lowQuery)
    );

    setSearchResults(filtered);
  }, 1000);

  useEffect(() => {
    dispatch(requestPatientsList());
  }, [dispatch]);

  const handleChange = (event) => {
    const text = event.target.value;
    setSearchTerm(text);
    throttledFilter(text, patientList);
  };

  const handlePatientSelect = (patient) => {
    dispatch(selectPatient(patient));
    setSearchTerm('');
  };

  let searchContent;

  if (searchTerm.length < 3) {
    searchContent = '';
  } else if (searchResults.length) {
    searchContent = searchResults.map((patient) => (
      <Dropdown.Item
        key={patient.id}
        eventKey="1"
        onClick={() => handlePatientSelect(patient)}
        id={patient.id}
      >
        <div className="patient-search-card">
          <p>{patient.healthInsuranceNumber},</p>
          <p>{patient.name}</p>
        </div>
      </Dropdown.Item>
    ));
  } else {
    searchContent = <Dropdown.Item>Совпадений не найдено</Dropdown.Item>;
  }

  return (
    <div className="left-bar-container__block">
      <div className="left-bar-container__block__top">
        <h5 className="leftbar-title">Пациент</h5>
        <PatientDropdown
          className="btn btn-secondary btn-sm dropdown-toggle patient-button"
          id="dropdownMenuButton"
        />
      </div>
          { selectedPatient ? <PatientsCard checkedPatient={selectedPatient} />
          : (
          <div className="left-bar-container__block__bottom">
            <div className="custom-input-container">
              <input
                type="search"
                placeholder="Введите текст для поиска"
                aria-label="текст для поиска"
                aria-describedby="basic-addon2"
                onChange={handleChange}
                value={searchTerm}
              />
              <div className="input-button">
                <span><i className="large material-icons">search</i></span>
              </div>
            </div>
            {searchContent}
          </div>
        )}
    </div>

  );
};

export default SearchWidget;
