import {
  SELECT_DATE,
  SET_TIME_FILTER,
} from '../constants/constants';

export const selectDate = date => ({
  payload: date,
  type: SELECT_DATE,
});

export const setTimeFilter = range => ({
  payload: range,
  type: SET_TIME_FILTER,
});
