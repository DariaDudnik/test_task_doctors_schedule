import {
  SELECT_DATE,
  TOGGLE_CALENDAR,
  SET_TIME_FILTER,
} from '../constants/constants';
import produce from "immer";
import moment from 'moment';

const todayStart = new Date();
todayStart.setHours(0);
todayStart.setMinutes(0);
todayStart.setSeconds(0);

const initialState = {
  currentDate: todayStart,
  timeRangeFrom: moment(),
  timeRangeTo: moment(),
  dayFilterInterval: 0,
};

const schedule = (state = initialState, action) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SELECT_DATE:
        draftState.currentDate = action.payload;
        const filter = moment(draftState.currentDate).add(draftState.dayFilterInterval, 'day')
        if(draftState.currentDate !== null) {
          draftState.timeRangeFrom = draftState.currentDate;
        }
        draftState.timeRangeTo = filter;
        break;
      case SET_TIME_FILTER:
        const timeRangeFrom = moment(draftState.currentDate);
        const timeRangeTo = moment(draftState.currentDate).add(action.payload, 'days');

        draftState.timeRangeFrom = timeRangeFrom;
        draftState.timeRangeTo = timeRangeTo;
        draftState.dayFilterInterval = action.payload;
        break;
      default:
        return state;
    }
  });
};

export default schedule;

