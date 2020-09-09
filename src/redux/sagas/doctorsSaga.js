import { call, put, takeEvery } from 'redux-saga/effects';
import { getDoctorsList } from '../services-fake';
import {
  REQUEST_DOCTORS_LIST,
  REQUEST_DOCTORS_LIST_FAILED,
} from '../constants/constants';

import { requestDoctorsListSuccess } from '../actions/doctorsActions';

function *fetchDoctors() {
  try {
    const data = yield call(getDoctorsList);

    yield put(requestDoctorsListSuccess(data));
  } catch (error) {
    yield put({
      type:   REQUEST_DOCTORS_LIST_FAILED,
      message: error.message,
    });
  }
}

export default function *fetchDoctorsInfoWatcher() {
  yield takeEvery(REQUEST_DOCTORS_LIST, fetchDoctors);
}
