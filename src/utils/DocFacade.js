import { quotasTypes } from './constants';
import doctors from '../stub-data/doctors-data';
import moment from 'moment';

class DocFacade {
  static isWorkingDay(doctor, date) {
    const { contract } = doctor;
    const weekDay = moment(date).day();

    return (
      (!contract.period || (
        date >= contract.period.start &&
        date < contract.period.end
      )) &&
      contract.workWeek.includes(weekDay)
    );
  }

  static makeInterval(fillType, { start, end }) {
    return {
      time: start.format('HH:mm'),
      rangeString: `${start.format('HH:mm')}-${end.format('HH:mm')}`,
      startMoment: start,
      endMoment: end,
      fillType,
      fillStatus: [],
    };
  }

  static intervalContains(block, container) {
    return block.startMoment >= container.startMoment && block.endMoment < container.endMoment;
  }

  static injectQuotas(blocks, quotas) {
    let unitedBlocks = blocks.slice();
    const nonPatientQuotas = quotas.filter(block => block.fillType !== quotasTypes.PATIENT);

    nonPatientQuotas.forEach((quota) => {
      const patientBlocks = unitedBlocks.filter(block => block.fillType === quotasTypes.PATIENT);
      const otherBlocks = unitedBlocks.filter(block => block.fillType !== quotasTypes.PATIENT);

      const blocksWithQuota = patientBlocks.flatMap(patientBlock => {
        if (DocFacade.intervalContains(quota, patientBlock)) {
          const splitBlocks = [];
          if (quota.startMoment > patientBlock.startMoment) {
            splitBlocks.push(
              DocFacade.makeInterval(quotasTypes.PATIENT, {
                start: moment(patientBlock.startMoment),
                end: moment(quota.startMoment),
              }),
            );
          }

          splitBlocks.push(quota);

          if (quota.endMoment < patientBlock.endMoment) {
            splitBlocks.push(
              DocFacade.makeInterval(quotasTypes.PATIENT, {
                start: moment(quota.endMoment),
                end: moment(patientBlock.endMoment),
              }),
            );
          }
          return splitBlocks;
        } else {
          return patientBlock;
        }
      });

      unitedBlocks = otherBlocks.concat(blocksWithQuota);
    }, blocks);

    return unitedBlocks;
  }

  static splitAppointments(borders, blocks) {
    let time = moment(borders.start);
    let schedule = [];

    blocks.forEach(block => {
      let timeEnd = moment(time).add(borders.interval, 'minutes');
      if (block.fillType !== quotasTypes.PATIENT) {
        while (timeEnd <= block.startMoment) {
          time = timeEnd;
          timeEnd = moment(timeEnd).add(borders.interval, 'minutes');
        }
        if (time < block.startMoment) {
          schedule.push(
            DocFacade.makeInterval(quotasTypes.NOAPP, {
              start: moment(time),
              end: moment(block.startMoment),
            }),
          );
        }

        schedule.push(block);
        return;
      }

      while (time < block.startMoment) {
        time = moment(time).add(borders.interval, 'minutes');
      }
      if (time > block.startMoment) {
        schedule.push(
          DocFacade.makeInterval(quotasTypes.NOAPP, {
            start: moment(block.startMoment),
            end: moment(time),
          })
        );
      }
      timeEnd = moment(time).add(borders.interval, 'minutes');
      while (timeEnd <= block.endMoment) {
        schedule.push(
          DocFacade.makeInterval(quotasTypes.PATIENT, {
            start: moment(time),
            end: moment(timeEnd),
          }),
        );
        schedule.hasAppointmentSlots = true;
        time = timeEnd;
        timeEnd = moment(timeEnd).add(borders.interval, 'minutes');
      }
    });

    return schedule;
  }

  static tapeIntervals(borders, quotas) {
    const firstQuotaStart = quotas.map(quota => quota.startMoment).reduce((min, start) => {
      return start < min ? start : min;
    });

    const lastQuotaEnd = quotas.map(quota => quota.endMoment).reduce((max, end) => {
      return end > max ? end : max;
    });

    const blocks = [
      DocFacade.makeInterval(quotasTypes.PATIENT, {
        start: moment(firstQuotaStart),
        end: moment(lastQuotaEnd)
      }),
    ];

    if (borders.start < firstQuotaStart) {
      blocks.push(
        DocFacade.makeInterval(quotasTypes.OFF, { start: moment(borders.start), end: moment(firstQuotaStart) }),
      );
    }

    if (borders.end > lastQuotaEnd) {
      blocks.push(
        DocFacade.makeInterval(quotasTypes.OFF, { start: moment(lastQuotaEnd), end: moment(borders.end) }),
      );
    }

    const intervalWithQuotas = DocFacade.injectQuotas(blocks, quotas);
    intervalWithQuotas.sort((left, right) => {
      return left.startMoment - right.startMoment;
    });

    return DocFacade.splitAppointments(borders, intervalWithQuotas);
  }

  static layeredIntervals(borders, quotas, scheduleSlots) {
    const { start, end, interval } = borders;

    let time = moment(start);
    const scheduleIntervals = []
    while (time <= end) {
      const intervalEnd = moment(time).add(interval, 'minutes');

      scheduleIntervals.push({
        time: time.format('HH:mm'),
        rangeString: `${time.format('HH:mm')}-${intervalEnd.format('HH:mm')}`,
        startMoment: time,
        endMoment: moment(intervalEnd), // copy just in case
        fillType: null, // it is not PATIENT now. It will become PATIENT after.
        fillStatus: [],
        hasAppointmentSlots: false,
      });

      time = intervalEnd;
    }

    const [ patientQuota ] = quotas.filter(q => q.fillType === quotasTypes.PATIENT);
    let patientedIntevals = scheduleIntervals;
    if (patientQuota) {
      patientedIntevals = scheduleIntervals.map(interval => {
        if (interval.start < patientQuota.startMoment) {
          return interval;
        } else if (interval.end > patientQuota.endMoment) {
          return interval;
        } else {
          return { ...interval, hasAppointmentSlots: true };
        }
      });
    }

    const otherQuotas = quotas.filter(q => q.fillType !== quotasTypes.PATIENT);
    const intervalsWithQuotas = otherQuotas.reduce((intervals, quota) => {
      const resultingArray = intervals.slice();

      let indexFrom;
      let foundFromIndex = false;
      let indexTo = 0;
      let foundToIndex = false;

      intervals.forEach((slot, index) => {
        if (!foundFromIndex && slot.endMoment > quota.startMoment) {
          indexFrom = index;
          foundFromIndex = true
        }

        if (!foundToIndex && slot.startMoment < quota.endMoment) {
          indexTo = index;
        }
      });

      resultingArray.splice(indexFrom, indexTo - indexFrom + 1, quota);
      return resultingArray;
    }, patientedIntevals);

    const collapsedNonAppointments = intervalsWithQuotas.reduce((state, interval) => {
      const isAlive = interval.hasAppointmentSlots  || interval.fillType !== quotasTypes.PATIENT;

      if (isAlive) {
        let toAdd = [interval]
        if (state.lastSeenNOAPP) {
          toAdd = [state.lastSeenNOAPP].concat(toAdd);
        }

        return {
          lastSeenNOAPP: null,
          result: toAdd,
        };
      }

      if (state.lastSeenNOAPP) {
        return {
          result: state.result,
          lastSeenNOAPP: {
            ...state.lastSeenNOAPP,
            endMoment: interval.endMoment,
          },
        };
      }

      return {
        result: state.result,
        lastSeenNOAPP: interval,
      }
    }, {
      result: [],
      lastSeenNOAPP: null,
    });

    // TODO: inject placehodlers where

    return collapsedNonAppointments;
  }

  static makeDaySchedule(doctor, date) {
    const momentDate = moment(date).set({ h: 0, m: 0, s: 0, ms: 0 });
    const weekDay = momentDate.day();

    const { contract } = doctor;
    if (!DocFacade.isWorkingDay(doctor, date)) {
      return null;
    }

    const quotasOfTheDay = contract.quotas
      .filter(quota => (quota.days || contract.workWeek).includes(weekDay))
      .map(quota => DocFacade.makeInterval(quota.type, {
        start: moment(date).set({ h: quota.timeFrom[0], m: quota.timeFrom[1], s: 0, ms: 0}),
        end: moment(date).set({ h: quota.timeTo[0], m: quota.timeTo[1], s: 0, ms: 0}),
      }));

    if (!quotasOfTheDay.length) {
      return [];
    }

    const appointments = doctor.contract.appointments
      .filter(appointment => moment(appointment.date).isSame(momentDate, 'day')); // get today appointments

    appointments.sort((left, right) => left.date - right.date);

    const { interval } = contract;
    const { timeFrom, timeTo } = contract.workDay;

    const schedule = DocFacade.tapeIntervals({
      start: moment(momentDate).set({ h: timeFrom[0], m: timeFrom[1] }),
      end: moment(momentDate).set({ h: timeTo[0], m: timeTo[1] }),
      interval,
    }, quotasOfTheDay);

    const scheduleI = schedule[Symbol.iterator]();
    let { value: slot } = scheduleI.next();
    appointments.forEach(app => {
      while (slot.startMoment < app.date) {
        ({ value: slot } = scheduleI.next());
      }

      if (slot.startMoment.isSame(app.date)) {
        slot.fillStatus.push(app);
      }
    });

    return schedule;
  }
}

export default DocFacade;

