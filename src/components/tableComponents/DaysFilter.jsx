import React from 'react';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeFilter } from '../../redux/actions/scheduleActions';

const DaysFilter = () => {
  const dayFilterInterval = useSelector(state => state.schedule.dayFilterInterval)
  const dispatch = useDispatch();

  const handleTimeRange = (range) => () => dispatch(setTimeFilter(range));

  return (
    <ButtonToolbar className="schedule-table-filter" >
    <div>Расписание специалистов</div>
      <ButtonGroup>
        <Button
          value={0}
          variant="success"
          onClick={handleTimeRange(0)}
          active={dayFilterInterval === 0}
          >1 день</Button>
        <Button
          value={1}
          variant="success"
          onClick={handleTimeRange(1)}
          active={dayFilterInterval === 1}
          >2 дня</Button>
        <Button
          variant="success"
          value={6}
          onClick={handleTimeRange(6)}
          active={dayFilterInterval === 6}
          >Неделя
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};

export default DaysFilter;

