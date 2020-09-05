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
        action.payload.forEach(item => {
          item.checked = false;
          item.appointments = item.appointments || [];
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
          const doctorIdx = draftState.doctorsList.findIndex(el =>  el.id === item);
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
        draftState.doctorsList.forEach(item => {
          if(item.id === action.payload) {
            item.checked = !item.checked;
          }

          return item;
        });
        break;
      case TOGGLE_ALL_DOCTORS:
        draftState.doctorsList.forEach(d => d.checked = action.payload);
        break;
      case CREATE_APPOINTMENT:
        const doctorIdx = draftState.doctorsList.findIndex(doc => doc.id === action.payload.doctorId);
        if (doctorIdx === -1) {
          return;
        }

        draftState.doctorsList[doctorIdx].appointments.push(action.payload);
        break;
      case CANCEL_APPOINTMENT:
        const doctorCancelIdx = draftState.doctorsList.findIndex(doc => doc.id === action.payload.doctorId);
        if (doctorCancelIdx === -1) {
          return;
        }

        const appToDeleteIdx = draftState.doctorsList[doctorCancelIdx].appointments.findIndex(x => x.date.isSame(action.payload.date));
        if (appToDeleteIdx === -1) {
          return;
        }
        draftState.doctorsList[doctorCancelIdx].appointments.splice(appToDeleteIdx, 1)
        break;
      default:
        return state;
    }
  });
};

export default doctors;

