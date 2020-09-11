import {
  REQUEST_PATIENTS_LIST,
  REQUEST_PATIENTS_LIST_FAILED,
  REQUEST_PATIENTS_LIST_SUCCESS,
  SELECT_PATIENT,
  REMOVE_PATIENT,
} from '../constants/constants';
import produce from "immer";

const initialState = {
  patientList: [],
  isLoading: false,
  selectedPatient: null,
};

const patients = (state = initialState, action) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case REQUEST_PATIENTS_LIST:
        draftState.isLoading = true;
        break;
      case  REQUEST_PATIENTS_LIST_SUCCESS:
        draftState.patientList = action.payload;
        draftState.isLoading = false;
        break;
      case REQUEST_PATIENTS_LIST_FAILED:
        return {
          ...state,
          keyword: action.payload,
          isLoading: false,
        };
      case SELECT_PATIENT:
        draftState.selectedPatient = action.payload;
        break;
      case REMOVE_PATIENT:
        draftState.selectedPatient = null;
        break;
      default:
        break;
    }
  });
};

export default patients;

