import patientsArray from '../stub-data/patientsData.json';
import messages from '../stub-data/messagesData.json';
import doctorsInfo from '../stub-data/doctors-data';

const delayed = (data) => new Promise(resolve => {
  setTimeout(() => {
    resolve(data);
  }, 300);
});

export function getDoctorsList() {
 return delayed(doctorsInfo);
}

export function getPatientsList() {
  return delayed(patientsArray);
}

export function getMessages() {
  return delayed(messages);
 }
