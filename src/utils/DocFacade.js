import { quotasTypes } from './constants';
import moment from 'moment';

class DocFacade {
  static isWorkingDay(doctor, date) {
    const { contract } = doctor;
    const weekDay = moment(date).weekday();

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
    return block.startMoment >= container.startMoment && block.endMoment <= container.endMoment;
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
      const timeEndMinimal = moment(time).add(borders.interval * 0.8, 'minutes');
      if (timeEndMinimal <= block.endMoment) {
        schedule.push(
          DocFacade.makeInterval(quotasTypes.PATIENT, {
            start: moment(time),
            end: moment(block.endMoment),
          }),
        );
        schedule.hasAppointmentSlots = true; // just in case
      }
      time = timeEnd;
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

  static makeDaySchedule(doctor, date) {
    const momentDate = moment(date).set({ h: 0, m: 0, s: 0, ms: 0 });
    const weekDay = momentDate.weekday();

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
      while (slot.endMoment.isSameOrBefore(moment(app.date))) {
        ({ value: slot } = scheduleI.next());
      }

      if (moment(app.date).isSameOrAfter(slot.startMoment) && moment(app.date).add(interval, 'minutes').isSameOrBefore(slot.endMoment)) {
        slot.fillStatus.push({
          ...app,
          startMoment: moment(app.date),
          endMoment: moment(app.date).add(interval, 'minutes'),
        });
        schedule.hasAppointmentSlots = true;
      }
    });

    return schedule;
  }
}

export default DocFacade;
