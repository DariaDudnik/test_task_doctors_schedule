import moment from 'moment';
import { quotasTypes } from '../utils/constants'
import patientsData from './patientsData.json';

const { patients } = patientsData;

const dayNames = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const weekRange = function (start, end, except = []) {
  const result = [];
  for (let i = start; i <= end; i++) {
    if (except.includes(i)) {
      continue;
    }
    result.push(i);
  }

  return result;
}

const monthsRange = (months) => {
  const start = moment().set({ h: 0, m: 0, s: 0, ms: 0 }).toDate();
  const end = moment().set({ h: 0, m: 0, s: 0, ms: 0 }).add(months, "months").toDate();

  return { start, end };
};

const doctors = [{
  id: 1,
  name: 'Григорьева Г.Г.',
  type: 'Терапевт',
  medicalFacility: "ГП №128",
}, {
  id: 2,
  name: 'Сидорова С.С.',
  type: 'Терапевт',
  medicalFacility: "ГП №128",
}, {
  id: 3,
  name: 'Елисеева',
  type: 'Офтальмолог',
  medicalFacility: "ГП №128",
}, {
  id: 4,
  name: 'Константинова-Щедрина А.А.',
  type: 'Офтальмолог',
  medicalFacility: "ГП №128",
}];

const doctorContracts = [{
  id: 1,
  doctorId: 1, // Григорьева
  room: "к.110",
  period: monthsRange(2),
  quotas: [{
    type: quotasTypes.OFF,
    name: 'Врач не работает',
    days: null,
    timeFrom: [14, 0],
    timeTo: [15, 0],
  }, {
    type: quotasTypes.PATIENT,
    name: 'Запись на прием',
    days: null,
    timeFrom: [10, 0],
    timeTo: [20, 0],
  }],
  workWeek: weekRange(dayNames.monday, dayNames.friday),
  workDay: {
    timeFrom: [10, 0],
    timeTo: [20, 0],
  },
  interval: 30,
  appointments: [],
}, {
  id: 2, // Сидорова пн-чт
  doctorId: 2,
  room: "к.120",
  period: monthsRange(2),
  quotas: [{
    type: quotasTypes.PATIENT,
    name: 'Запись на прием',
    days: null,
    timeFrom: [10, 0],
    timeTo: [15, 0],
  }, {
    type: quotasTypes.STUDY,
    name: 'Обучение',
    days: [dayNames.monday],
    timeFrom: [10, 0],
    timeTo: [15, 0],
  }],
  workWeek: weekRange(dayNames.monday, dayNames.thursday),
  workDay: {
    timeFrom: [8, 0],
    timeTo: [15, 0],
  },
  interval: 30,
  appointments: [],
}, {
  id: 3, // Сидорова пт-сб
  doctorId: 2,
  room: "к.130",
  period: monthsRange(1),
  quotas: [{
    type: quotasTypes.PATIENT,
    name: 'Запись на прием',
    days: null,
    timeFrom: [14, 0],
    timeTo: [18, 0],
  }],
  workWeek: [dayNames.friday, dayNames.saturday],
  workDay: {
    timeFrom: [14, 0],
    timeTo: [18, 0],
  },
  interval: 10,
  appointments: [],
}, {
  id: 4, // Елисеева
  doctorId: 3,
  room: "к.130",
  period: monthsRange(2),
  quotas: [{
    type: quotasTypes.PATIENT,
    name: 'Запись на прием',
    days: null,
    timeFrom: [10, 0],
    timeTo: [17, 45],
  }, {
    type: quotasTypes.PAPERWORK,
    name: 'Работа с документами',
    days: null,
    timeFrom: [14, 30],
    timeTo: [14, 55],
  }, {
    type: quotasTypes.PAPERWORK,
    name: 'Работа с документами',
    days: null,
    timeFrom: [16, 20],
    timeTo: [16, 40],
  }],
  workWeek: weekRange(dayNames.monday, dayNames.friday),
  workDay: {
    timeFrom: [8, 0],
    timeTo: [18, 0],
  },
  interval: 30,
  appointments: [],
}, {
  id: 5, // Константинова-Щедрина
  doctorId: 4,
  room: "к.130",
  period: null, // unlimited
  quotas: [{
    type: quotasTypes.PATIENT,
    name: 'Запись на прием',
    days: weekRange(dayNames.wednesday, dayNames.saturday),
    timeFrom: [9, 0],
    timeTo: [21, 0],
  }],
  workWeek: weekRange(dayNames.tuesday, dayNames.saturday),
  workDay: {
    timeFrom: [9, 0],
    timeTo: [21, 0],
  },
  interval: 30,
  appointments: [],
}];

const applyAppointments = (doctors) => {
  doctors[0].contract.appointments = [{
    patient: patients[0],
    date: moment().set({ h: 10, m: 0, s: 0, ms: 0 }).toDate(),
  }, {
    patient: patients[1],
    date: moment().set({ h: 10, m: 0, s: 0, ms: 0 }).toDate(),
  }, {
    patient: patients[2],
    date: moment().set({ h: 10, m: 30, s: 0, ms: 0 }).toDate(),
  }];

  // doctors[1].contract.appointments = [{
  //   patient: patients[3],
  //   date: moment().weekday(0).set({ h: 9, m: 30, s: 0, ms: 0 }).toDate(),
  // }];

  return doctors;
};

const joinData = (doctors, contracts) => contracts.map(cnt => {
  const doctor = doctors.find(doc => doc.id === cnt.doctorId);
  return {
    ...doctor,
    contract: cnt,
  };
});

const data = joinData(doctors, doctorContracts);
applyAppointments(data);

export default data;
