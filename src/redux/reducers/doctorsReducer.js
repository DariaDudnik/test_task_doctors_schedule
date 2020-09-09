import {
  REQUEST_DOCTORS_LIST,
  REQUEST_DOCTORS_LIST_SUCCESS,
  REQUEST_DOCTORS_LIST_FAILED,
  TOGGLE_DOCTOR,
  SET_CURRENT_DOCTOR,
  TOGGLE_ALL_DOCTORS,
  TOGGLE_DOCTORS_BY_TYPE,
  CREATE_APPOINTMENT,
  CANCEL_APPOINTMENT,
} from '../constants/constants';
import produce from "immer";
import moment from "moment";

const initialState = {
  doctorsList: [],
  isLoading: false,
  appointment: {},
  currentDoctor: {},
  appointmentDate: null,
};

const doctors = (state = initialState, action) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case REQUEST_DOCTORS_LIST:
        draftState.isLoading = true;
        break;
      case REQUEST_DOCTORS_LIST_SUCCESS:
        action.payload.forEach(doctor => {
          doctor.checked = false;
        });
        draftState.doctorsList = action.payload;
        draftState.isLoading = false;
        break;
      case REQUEST_DOCTORS_LIST_FAILED:
        draftState.keyword = action.payload;
        draftState.isLoading = false;
        break;
      case TOGGLE_DOCTORS_BY_TYPE:
        const { ids, newVal } = action.payload;
        ids.forEach(item => {
          const doctorIdx = draftState.doctorsList.findIndex(doctor =>  doctor.contract.id === item);
          if (doctorIdx !== -1) {
            draftState.doctorsList[doctorIdx].checked = newVal;
          }
        });
        break;
      case SET_CURRENT_DOCTOR:
        draftState.currentDoctor = action.payload.doctor;
        if (action.payload.date) {
          draftState.appointmentDate = action.payload.date;
        }
        break;
      case TOGGLE_DOCTOR:
        draftState.doctorsList.forEach(doctor => {
          if(doctor.contract.id === action.payload) {
            doctor.checked = !doctor.checked;
          }
        });
        break;
      case TOGGLE_ALL_DOCTORS:
        draftState.doctorsList.forEach(d => d.checked = action.payload);
        break;
      case CREATE_APPOINTMENT:
        const doctorIdx = draftState.doctorsList.findIndex(doc => doc.contract.id === action.payload.doctor.contract.id);
        console.log('CREATE_APPOINTMENT', doctorIdx)
        if (doctorIdx === -1) {
          return;
        }

        console.log('CREATE_APPOINTMENT', state.doctorsList[doctorIdx])

        draftState.doctorsList[doctorIdx].contract.appointments.push(action.payload);
        break;
      case CANCEL_APPOINTMENT:
        const doctors = draftState.doctorsList;
        const doctorCancelIdx = doctors.findIndex(doc => doc.id === action.payload.doctor.id);
        if (doctorCancelIdx === -1) {
          return;
        }
        const doctor = doctors[doctorCancelIdx];

        const appToDeleteIdx = doctor.contract.appointments
          .findIndex(app => {
            const sameTime = moment(app.date).isSame(action.payload.date);
            const samePatient = app.patient.id === action.payload.patient.id;
            return sameTime && samePatient;
          });

        if (appToDeleteIdx === -1) {
          return;
        }

        draftState.doctorsList[doctorCancelIdx].contract.appointments.splice(appToDeleteIdx, 1)
        break;
      default:
        return state;
    }
  });
};

export default doctors;

